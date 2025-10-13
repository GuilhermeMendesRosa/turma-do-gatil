import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UploadService } from './upload.service';
import { NotificationService } from './notification.service';
import { environment } from '../../environments/environment';

describe('UploadService', () => {
  let service: UploadService;
  let httpMock: HttpTestingController;
  let notificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['showHttpError']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UploadService,
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    });

    service = TestBed.inject(UploadService);
    httpMock = TestBed.inject(HttpTestingController);
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('uploadImage', () => {
    it('should upload an image and return the URL', () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const mockResponse = { 
        fileName: 'test.jpg',
        fileUrl: 'https://s3.amazonaws.com/test.jpg',
        fileSize: 1024,
        contentType: 'image/jpeg'
      };

      service.uploadImage(mockFile).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.fileUrl).toBe('https://s3.amazonaws.com/test.jpg');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/images/upload`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body instanceof FormData).toBeTruthy();
      req.flush(mockResponse);
    });

    it('should handle upload error', () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const mockError = { status: 500, statusText: 'Internal Server Error' };

      service.uploadImage(mockFile).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(notificationService.showHttpError).toHaveBeenCalled();
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/images/upload`);
      req.flush(null, mockError);
    });
  });

  describe('validateImageFile', () => {
    it('should accept valid image types', () => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      
      validTypes.forEach(type => {
        const file = new File(['test'], 'test.jpg', { type });
        const result = service.validateImageFile(file);
        expect(result.valid).toBeTruthy();
      });
    });

    it('should reject invalid image types', () => {
      const file = new File(['test'], 'test.pdf', { type: 'application/pdf' });
      const result = service.validateImageFile(file);
      
      expect(result.valid).toBeFalsy();
      expect(result.error).toContain('Tipo de arquivo inválido');
    });

    it('should reject files larger than 5MB', () => {
      const largeSize = 6 * 1024 * 1024; // 6MB
      const file = new File([new ArrayBuffer(largeSize)], 'large.jpg', { type: 'image/jpeg' });
      const result = service.validateImageFile(file);
      
      expect(result.valid).toBeFalsy();
      expect(result.error).toContain('muito grande');
    });

    it('should accept files smaller than 5MB', () => {
      const smallSize = 1 * 1024 * 1024; // 1MB
      const file = new File([new ArrayBuffer(smallSize)], 'small.jpg', { type: 'image/jpeg' });
      const result = service.validateImageFile(file);
      
      expect(result.valid).toBeTruthy();
    });
  });
});
