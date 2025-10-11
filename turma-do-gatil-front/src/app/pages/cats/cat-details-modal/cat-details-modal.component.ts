import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';

import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
// import { TabViewModule } from 'primeng/tabview';
// import { EditorModule } from 'primeng/editor';
// import { ProgressSpinnerModule } from 'primeng/progressspinner';
// import { ConfirmDialogModule } from 'primeng/confirmdialog';
// import { ConfirmationService, MessageService } from 'primeng/api';
import { Cat, Color, Sex, CatAdoptionStatus } from '../../../models/cat.model';
import { Note, NoteRequest } from '../../../models/note.model';
import { SterilizationDto } from '../../../models/sterilization.model';
import { NoteService } from '../../../services/note.service';
import { SterilizationService } from '../../../services/sterilization.service';
import { AdoptionModalComponent } from '../adoption-modal/adoption-modal.component';
import { GenericButtonComponent, GenericButtonConfig } from '../../../shared/components/generic-button.component';

@Component({
  selector: 'app-cat-details-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    DividerModule,
    TagModule,
    TooltipModule,
    // TabViewModule,
    // EditorModule,
    // ProgressSpinnerModule,
    // ConfirmDialogModule,
    AdoptionModalComponent,
    GenericButtonComponent
  ],
  templateUrl: './cat-details-modal.component.html',
  styleUrl: './cat-details-modal.component.css'
})
export class CatDetailsModalComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Input() cat: Cat | null = null;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() adoptCat = new EventEmitter<Cat>();
  @Output() editCat = new EventEmitter<Cat>();
  @Output() deleteCat = new EventEmitter<Cat>();

  showAdoptionModal = false;

  // Tab management
  activeTab: 'info' | 'notes' = 'info';

  // Notes properties
  notes: Note[] = [];
  loadingNotes = false;
  showAddNoteForm = false;
  newNoteText = '';
  savingNote = false;
  editingNoteId: string | null = null;
  editingNoteText = '';

  // Sterilization properties
  sterilizations: SterilizationDto[] = [];
  loadingSterilizations = false;

  // Button configurations
  get adoptButtonConfig(): GenericButtonConfig {
    return {
      label: 'Adotar',
      icon: 'pi-heart',
      severity: 'primary'
    };
  }

  get editButtonConfig(): GenericButtonConfig {
    return {
      label: 'Editar',
      icon: 'pi-pencil',
      severity: 'secondary'
    };
  }

  get deleteButtonConfig(): GenericButtonConfig {
    return {
      label: 'Deletar',
      icon: 'pi-trash',
      severity: 'danger',
      outlined: true
    };
  }

  get saveNoteButtonConfig(): GenericButtonConfig {
    return {
      label: 'Salvar',
      icon: 'pi-check',
      loading: this.savingNote
    };
  }

  get cancelButtonConfig(): GenericButtonConfig {
    return {
      label: 'Cancelar',
      icon: 'pi-times',
      severity: 'secondary',
      outlined: true
    };
  }

  get addNoteButtonConfig(): GenericButtonConfig {
    return {
      label: 'Nova Anotação',
      icon: 'pi-plus',
      size: 'small'
    };
  }

  constructor(
    private noteService: NoteService,
    private sterilizationService: SterilizationService
    // private confirmationService: ConfirmationService,
    // private messageService: MessageService
  ) { }

  ngOnInit(): void {
    // Carrega as notas quando o componente é inicializado
    if (this.cat?.id) {
      this.loadNotes();
      this.loadSterilizations();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Carrega as notas quando o gato muda
    if (changes['cat'] && this.cat?.id) {
      this.loadNotes();
      this.loadSterilizations();
    }
  }

  onHide(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    
    // Reset notes form state
    this.activeTab = 'info';
    this.showAddNoteForm = false;
    this.newNoteText = '';
    this.editingNoteId = null;
    this.editingNoteText = '';
  }

  onAdoptCat(): void {
    this.showAdoptionModal = true;
  }

  onAdoptionCreated(): void {
    this.showAdoptionModal = false;
    this.adoptCat.emit(this.cat!);
  }

  onEditCat(): void {
    if (this.cat) {
      this.editCat.emit(this.cat);
    }
  }

  onDeleteCat(): void {
    if (this.cat) {
      this.deleteCat.emit(this.cat);
    }
  }

  getColorLabel(color: Color): string {
    const colorMap: { [key in Color]: string } = {
      [Color.WHITE]: 'Branco',
      [Color.BLACK]: 'Preto',
      [Color.GRAY]: 'Cinza',
      [Color.BROWN]: 'Marrom',
      [Color.ORANGE]: 'Laranja',
      [Color.MIXED]: 'Misto',
      [Color.CALICO]: 'Cálico',
      [Color.TABBY]: 'Tigrado',
      [Color.SIAMESE]: 'Siamês',
      [Color.OTHER]: 'Outro'
    };
    return colorMap[color] || color;
  }

  getSexLabel(sex: Sex): string {
    return sex === Sex.MALE ? 'Macho' : 'Fêmea';
  }

  getAge(birthDate: string): string {
    const birth = new Date(birthDate);
    const today = new Date();
    const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
    
    if (ageInMonths < 12) {
      return `${ageInMonths} ${ageInMonths === 1 ? 'mês' : 'meses'}`;
    } else {
      const years = Math.floor(ageInMonths / 12);
      return `${years} ${years === 1 ? 'ano' : 'anos'}`;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getDaysInShelter(entryDate: string): number {
    const entry = new Date(entryDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - entry.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getDefaultImage(): string {
    return 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
  }

  onImageError(event: any): void {
    event.target.src = this.getDefaultImage();
  }

  getAdoptionStatusText(status: CatAdoptionStatus): string {
    switch(status) {
      case CatAdoptionStatus.NAO_ADOTADO:
        return 'Disponível para Adoção';
      case CatAdoptionStatus.EM_PROCESSO:
        return 'Em Processo de Adoção';
      case CatAdoptionStatus.ADOTADO:
        return 'Adotado';
      default:
        return 'Disponível para Adoção';
    }
  }

  getAdoptionStatusIcon(status: CatAdoptionStatus): string {
    switch(status) {
      case CatAdoptionStatus.NAO_ADOTADO:
        return 'fa-heart';
      case CatAdoptionStatus.EM_PROCESSO:
        return 'fa-clock';
      case CatAdoptionStatus.ADOTADO:
        return 'fa-home';
      default:
        return 'fa-heart';
    }
  }

  getAdoptionTagText(status: CatAdoptionStatus): string {
    switch(status) {
      case CatAdoptionStatus.NAO_ADOTADO:
        return 'Disponível';
      case CatAdoptionStatus.EM_PROCESSO:
        return 'Em Processo';
      case CatAdoptionStatus.ADOTADO:
        return 'Adotado';
      default:
        return 'Disponível';
    }
  }

  getAdoptionTagSeverity(status: CatAdoptionStatus): string {
    switch(status) {
      case CatAdoptionStatus.NAO_ADOTADO:
        return 'info';
      case CatAdoptionStatus.EM_PROCESSO:
        return 'warn';
      case CatAdoptionStatus.ADOTADO:
        return 'success';
      default:
        return 'info';
    }
  }

  // Notes methods
  loadNotes(): void {
    if (!this.cat?.id) return;
    
    this.loadingNotes = true;
    this.noteService.getNotesByCatId(this.cat.id).subscribe({
      next: (notes) => {
        this.notes = notes.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        this.loadingNotes = false;
      },
      error: (error) => {
        console.error('Erro ao carregar anotações:', error);
        this.loadingNotes = false;
      }
    });
  }

  startAddNote(): void {
    this.showAddNoteForm = true;
    this.newNoteText = '';
  }

  cancelAddNote(): void {
    this.showAddNoteForm = false;
    this.newNoteText = '';
  }

  saveNote(): void {
    if (!this.cat?.id || !this.newNoteText.trim()) {
      alert('Por favor, digite o texto da anotação.');
      return;
    }

    this.savingNote = true;
    const noteRequest: NoteRequest = {
      catId: this.cat.id,
      date: new Date().toISOString(),
      text: this.newNoteText.trim()
    };

    this.noteService.createNote(noteRequest).subscribe({
      next: (note) => {
        this.notes.unshift(note);
        this.showAddNoteForm = false;
        this.newNoteText = '';
        this.savingNote = false;
        alert('Anotação salva com sucesso!');
      },
      error: (error) => {
        console.error('Erro ao salvar anotação:', error);
        this.savingNote = false;
      }
    });
  }

  startEditNote(note: Note): void {
    this.editingNoteId = note.id;
    this.editingNoteText = note.text;
  }

  cancelEditNote(): void {
    this.editingNoteId = null;
    this.editingNoteText = '';
  }

  saveEditNote(note: Note): void {
    if (!this.editingNoteText.trim()) {
      alert('Por favor, digite o texto da anotação.');
      return;
    }

    this.savingNote = true;
    const noteRequest: NoteRequest = {
      catId: note.catId,
      date: note.date,
      text: this.editingNoteText.trim()
    };

    this.noteService.updateNote(note.id, noteRequest).subscribe({
      next: (updatedNote) => {
        const index = this.notes.findIndex(n => n.id === note.id);
        if (index !== -1) {
          this.notes[index] = updatedNote;
        }
        this.editingNoteId = null;
        this.editingNoteText = '';
        this.savingNote = false;
        alert('Anotação atualizada com sucesso!');
      },
      error: (error) => {
        console.error('Erro ao atualizar anotação:', error);
        this.savingNote = false;
      }
    });
  }

  confirmDeleteNote(note: Note): void {
    if (confirm('Tem certeza que deseja excluir esta anotação? Esta ação não pode ser desfeita.')) {
      this.deleteNote(note);
    }
  }

  deleteNote(note: Note): void {
    this.noteService.deleteNote(note.id).subscribe({
      next: () => {
        this.notes = this.notes.filter(n => n.id !== note.id);
        alert('Anotação excluída com sucesso!');
      },
      error: (error) => {
        console.error('Erro ao excluir anotação:', error);
      }
    });
  }

  trackByNoteId(index: number, note: Note): string {
    return note.id;
  }

  // Sterilization methods
  loadSterilizations(): void {
    if (!this.cat?.id) return;
    
    this.loadingSterilizations = true;
    this.sterilizationService.getSterilizationsByCatId(this.cat.id).subscribe({
      next: (sterilizations) => {
        this.sterilizations = sterilizations.sort((a, b) => 
          new Date(b.sterilizationDate).getTime() - new Date(a.sterilizationDate).getTime()
        );
        this.loadingSterilizations = false;
      },
      error: (error) => {
        console.error('Erro ao carregar informações de castração:', error);
        this.loadingSterilizations = false;
      }
    });
  }

  getSterilizationStatusText(): string {
    if (!this.sterilizations || this.sterilizations.length === 0) {
      return 'Não castrado';
    }

    const completed = this.sterilizations.find(s => s.status === 'COMPLETED');
    if (completed) {
      return 'Castrado';
    }

    const scheduled = this.sterilizations.find(s => s.status === 'SCHEDULED');
    if (scheduled) {
      return 'Castração agendada';
    }

    return 'Não castrado';
  }

  getSterilizationStatusSeverity(): string {
    if (!this.sterilizations || this.sterilizations.length === 0) {
      return 'warn';
    }

    const completed = this.sterilizations.find(s => s.status === 'COMPLETED');
    if (completed) {
      return 'success';
    }

    const scheduled = this.sterilizations.find(s => s.status === 'SCHEDULED');
    if (scheduled) {
      return 'info';
    }

    return 'warn';
  }

  getSterilizationDate(): string | null {
    if (!this.sterilizations || this.sterilizations.length === 0) {
      return null;
    }

    const completed = this.sterilizations.find(s => s.status === 'COMPLETED');
    if (completed) {
      return this.formatDate(completed.sterilizationDate);
    }

    const scheduled = this.sterilizations.find(s => s.status === 'SCHEDULED');
    if (scheduled) {
      return this.formatDate(scheduled.sterilizationDate);
    }

    return null;
  }

  hasSterilizationNotes(): boolean {
    if (!this.sterilizations || this.sterilizations.length === 0) {
      return false;
    }

    return this.sterilizations.some(s => s.notes && s.notes.trim().length > 0);
  }

  getSterilizationNotes(): string {
    if (!this.sterilizations || this.sterilizations.length === 0) {
      return '';
    }

    const withNotes = this.sterilizations.filter(s => s.notes && s.notes.trim().length > 0);
    return withNotes.map(s => `${this.formatDate(s.sterilizationDate)}: ${s.notes}`).join('\n');
  }
}
