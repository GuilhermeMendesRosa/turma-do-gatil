package br.com.udesc.turma_do_gatil_back.controllers;

import br.com.udesc.turma_do_gatil_back.dto.AdoptionDto;
import br.com.udesc.turma_do_gatil_back.entities.Adoption;
import br.com.udesc.turma_do_gatil_back.enums.AdoptionStatus;
import br.com.udesc.turma_do_gatil_back.mappers.EntityMapper;
import br.com.udesc.turma_do_gatil_back.services.AdoptionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/adoptions")
@CrossOrigin(originPatterns = "*", maxAge = 3600)
@Tag(name = "Adoções", description = "API para gerenciamento de adoções de gatos")
public class AdoptionController {

    @Autowired
    private AdoptionService adoptionService;

    @Operation(
        summary = "Listar todas as adoções",
        description = "Retorna uma lista paginada de todas as adoções com opções de filtro e ordenação"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de adoções retornada com sucesso",
                    content = @Content(mediaType = "application/json",
                                     schema = @Schema(implementation = Page.class))),
        @ApiResponse(responseCode = "400", description = "Parâmetros inválidos")
    })
    @GetMapping
    public ResponseEntity<Page<AdoptionDto>> getAllAdoptions(
            @Parameter(description = "Número da página (iniciando em 0)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Tamanho da página") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Campo para ordenação") @RequestParam(defaultValue = "adoptionDate") String sortBy,
            @Parameter(description = "Direção da ordenação (asc/desc)") @RequestParam(defaultValue = "desc") String sortDir,
            @Parameter(description = "Filtrar por status da adoção") @RequestParam(required = false) AdoptionStatus status,
            @Parameter(description = "Filtrar por ID do gato") @RequestParam(required = false) UUID catId,
            @Parameter(description = "Filtrar por ID do adotante") @RequestParam(required = false) UUID adopterId,
            @Parameter(description = "Data inicial para filtro") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @Parameter(description = "Data final para filtro") @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Adoption> adoptions;
        if (status != null || catId != null || adopterId != null || startDate != null || endDate != null) {
            adoptions = adoptionService.findWithFilters(status, catId, adopterId, startDate, endDate, pageable);
        } else {
            adoptions = adoptionService.findAll(pageable);
        }

        Page<AdoptionDto> adoptionsDto = EntityMapper.toPage(adoptions, EntityMapper::toAdoptionDto);
        return ResponseEntity.ok(adoptionsDto);
    }

    @Operation(
        summary = "Buscar adoção por ID",
        description = "Retorna uma adoção específica pelo seu ID"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Adoção encontrada",
                    content = @Content(mediaType = "application/json",
                                     schema = @Schema(implementation = AdoptionDto.class))),
        @ApiResponse(responseCode = "404", description = "Adoção não encontrada")
    })
    @GetMapping("/{id}")
    public ResponseEntity<AdoptionDto> getAdoptionById(
            @Parameter(description = "ID da adoção") @PathVariable UUID id) {
        Optional<Adoption> adoption = adoptionService.findById(id);
        return adoption.map(a -> ResponseEntity.ok(EntityMapper.toAdoptionDto(a)))
                      .orElse(ResponseEntity.notFound().build());
    }

    @Operation(
        summary = "Criar nova adoção",
        description = "Cria um novo processo de adoção vinculando um gato a um adotante. " +
                     "O status inicial pode ser PENDING, COMPLETED ou CANCELED."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Adoção criada com sucesso",
                    content = @Content(mediaType = "application/json",
                                     schema = @Schema(implementation = AdoptionDto.class))),
        @ApiResponse(responseCode = "400", description = "Dados inválidos fornecidos")
    })
    @PostMapping
    public ResponseEntity<AdoptionDto> createAdoption(
            @Parameter(description = "Dados da adoção a ser criada") @RequestBody AdoptionDto adoptionDto) {
        try {
            Adoption adoption = EntityMapper.toAdoptionEntity(adoptionDto);
            Adoption savedAdoption = adoptionService.save(adoption);
            return ResponseEntity.status(HttpStatus.CREATED).body(EntityMapper.toAdoptionDto(savedAdoption));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(
        summary = "Atualizar adoção",
        description = "Atualiza uma adoção existente. Pode ser usado para alterar o status da adoção."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Adoção atualizada com sucesso",
                    content = @Content(mediaType = "application/json",
                                     schema = @Schema(implementation = AdoptionDto.class))),
        @ApiResponse(responseCode = "404", description = "Adoção não encontrada"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos fornecidos")
    })
    @PutMapping("/{id}")
    public ResponseEntity<AdoptionDto> updateAdoption(
            @Parameter(description = "ID da adoção") @PathVariable UUID id,
            @Parameter(description = "Dados atualizados da adoção") @RequestBody AdoptionDto adoptionDto) {
        try {
            Adoption adoption = EntityMapper.toAdoptionEntity(adoptionDto);
            Adoption updatedAdoption = adoptionService.update(id, adoption);
            return ResponseEntity.ok(EntityMapper.toAdoptionDto(updatedAdoption));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @Operation(
        summary = "Excluir adoção",
        description = "Remove uma adoção do sistema"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Adoção excluída com sucesso"),
        @ApiResponse(responseCode = "404", description = "Adoção não encontrada")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdoption(
            @Parameter(description = "ID da adoção") @PathVariable UUID id) {
        try {
            adoptionService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(
        summary = "Listar adoções por gato",
        description = "Retorna todas as adoções de um gato específico"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de adoções do gato",
                    content = @Content(mediaType = "application/json",
                                     schema = @Schema(implementation = List.class)))
    })
    @GetMapping("/cat/{catId}")
    public ResponseEntity<List<AdoptionDto>> getAdoptionsByCatId(
            @Parameter(description = "ID do gato") @PathVariable UUID catId) {
        // Como o serviço retorna Page, vamos usar paginação com valores padrão
        Pageable pageable = PageRequest.of(0, 1000); // Página grande para pegar todos
        Page<Adoption> adoptionsPage = adoptionService.findByCatId(catId, pageable);
        List<AdoptionDto> adoptionsDto = EntityMapper.toList(adoptionsPage.getContent(), EntityMapper::toAdoptionDto);
        return ResponseEntity.ok(adoptionsDto);
    }

    @Operation(
        summary = "Listar adoções por adotante",
        description = "Retorna todas as adoções de um adotante específico"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de adoções do adotante",
                    content = @Content(mediaType = "application/json",
                                     schema = @Schema(implementation = List.class)))
    })
    @GetMapping("/adopter/{adopterId}")
    public ResponseEntity<List<AdoptionDto>> getAdoptionsByAdopterId(
            @Parameter(description = "ID do adotante") @PathVariable UUID adopterId) {
        // Como o serviço retorna Page, vamos usar paginação com valores padrão
        Pageable pageable = PageRequest.of(0, 1000); // Página grande para pegar todos
        Page<Adoption> adoptionsPage = adoptionService.findByAdopterId(adopterId, pageable);
        List<AdoptionDto> adoptionsDto = EntityMapper.toList(adoptionsPage.getContent(), EntityMapper::toAdoptionDto);
        return ResponseEntity.ok(adoptionsDto);
    }

    @Operation(
        summary = "Listar adoções por status",
        description = "Retorna uma lista paginada de adoções filtradas por status"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista de adoções por status",
                    content = @Content(mediaType = "application/json",
                                     schema = @Schema(implementation = Page.class)))
    })
    @GetMapping("/status/{status}")
    public ResponseEntity<Page<AdoptionDto>> getAdoptionsByStatus(
            @Parameter(description = "Status da adoção") @PathVariable AdoptionStatus status,
            @Parameter(description = "Número da página") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Tamanho da página") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Campo para ordenação") @RequestParam(defaultValue = "adoptionDate") String sortBy,
            @Parameter(description = "Direção da ordenação") @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Adoption> adoptions = adoptionService.findByStatus(status, pageable);
        Page<AdoptionDto> adoptionsDto = EntityMapper.toPage(adoptions, EntityMapper::toAdoptionDto);
        return ResponseEntity.ok(adoptionsDto);
    }
}
