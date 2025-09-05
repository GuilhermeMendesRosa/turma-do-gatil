package br.com.udesc.turma_do_gatil_back.controllers;

import br.com.udesc.turma_do_gatil_back.dto.CatDto;
import br.com.udesc.turma_do_gatil_back.dto.CatSterilizationStatusDto;
import br.com.udesc.turma_do_gatil_back.dto.SterilizationStatsDto;
import br.com.udesc.turma_do_gatil_back.entities.Cat;
import br.com.udesc.turma_do_gatil_back.enums.Color;
import br.com.udesc.turma_do_gatil_back.enums.Sex;
import br.com.udesc.turma_do_gatil_back.mappers.EntityMapper;
import br.com.udesc.turma_do_gatil_back.services.CatService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/cats")
@CrossOrigin(originPatterns = "*", maxAge = 3600)
@Tag(name = "Gatos", description = "Operações relacionadas ao gerenciamento de gatos")
public class CatController {

    @Autowired
    private CatService catService;

    @GetMapping
    public ResponseEntity<Page<CatDto>> getAllCats(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Color color,
            @RequestParam(required = false) Sex sex,
            @RequestParam(required = false) Boolean adopted) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Cat> cats;
        if (name != null || color != null || sex != null || adopted != null) {
            cats = catService.findWithFilters(name, color, sex, adopted, pageable);
        } else {
            cats = catService.findAll(pageable);
        }

        Page<CatDto> catsDto = EntityMapper.toPage(cats, EntityMapper::toCatDto);
        return ResponseEntity.ok(catsDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CatDto> getCatById(@PathVariable UUID id) {
        Optional<Cat> cat = catService.findById(id);
        return cat.map(c -> ResponseEntity.ok(EntityMapper.toCatDto(c)))
                  .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CatDto> createCat(@RequestBody CatDto catDto) {
        try {
            Cat cat = EntityMapper.toCatEntity(catDto);
            Cat savedCat = catService.save(cat);
            return ResponseEntity.status(HttpStatus.CREATED).body(EntityMapper.toCatDto(savedCat));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<CatDto> updateCat(@PathVariable UUID id, @RequestBody CatDto catDto) {
        try {
            Cat cat = EntityMapper.toCatEntity(catDto);
            Cat updatedCat = catService.update(id, cat);
            return ResponseEntity.ok(EntityMapper.toCatDto(updatedCat));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCat(@PathVariable UUID id) {
        try {
            catService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/adopted/{adopted}")
    public ResponseEntity<Page<CatDto>> getCatsByAdoptionStatus(
            @PathVariable Boolean adopted,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
            ? Sort.by(sortBy).descending()
            : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Cat> cats = catService.findByAdopted(adopted, pageable);
        Page<CatDto> catsDto = EntityMapper.toPage(cats, EntityMapper::toCatDto);
        return ResponseEntity.ok(catsDto);
    }

    @Operation(
        summary = "Buscar gatos que precisam de castração",
        description = "Retorna uma lista de gatos que estão aptos para castração baseado nas seguintes regras:\n\n" +
                     "**Critérios de Elegibilidade:**\n" +
                     "- Gato deve ter pelo menos **90 dias de vida**\n" +
                     "- Gato **não deve ter sido castrado** (status COMPLETED)\n" +
                     "- Gato **não deve ter castração agendada** (status SCHEDULED)\n" +
                     "- Apenas gatos **não adotados** são considerados\n\n" +
                     "**Status Retornados:**\n" +
                     "- `ELIGIBLE`: Gato com 90-179 dias, apto para castração\n" +
                     "- `OVERDUE`: Gato com 180+ dias, castração atrasada\n\n" +
                     "**Informações Retornadas:**\n" +
                     "- Dados básicos do gato (nome, cor, sexo, foto)\n" +
                     "- Idade exata em dias\n" +
                     "- Status de prioridade para castração",
        tags = {"Gatos"}
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Lista de gatos que precisam de castração retornada com sucesso",
            content = @Content(
                mediaType = "application/json",
                array = @ArraySchema(schema = @Schema(implementation = CatSterilizationStatusDto.class))
            )
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Erro interno do servidor ao processar a solicitação",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{ \"error\": \"Internal server error\" }")
            )
        )
    })
    @GetMapping("/needing-sterilization")
    public ResponseEntity<List<CatSterilizationStatusDto>> getCatsNeedingSterilization() {
        try {
            List<CatSterilizationStatusDto> cats = catService.findCatsNeedingSterilization();
            return ResponseEntity.ok(cats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @Operation(
        summary = "Obter estatísticas de castração",
        description = "Retorna as estatísticas resumidas sobre gatos que precisam de castração:\n\n" +
                     "**Informações Retornadas:**\n" +
                     "- `eligibleCount`: Quantidade de gatos elegíveis para castração (90-179 dias)\n" +
                     "- `overdueCount`: Quantidade de gatos com castração atrasada (180+ dias)\n" +
                     "- `totalNeedingSterilization`: Total de gatos que precisam de castração\n\n" +
                     "**Critérios Aplicados:**\n" +
                     "- Apenas gatos não adotados\n" +
                     "- Gatos com pelo menos 90 dias de vida\n" +
                     "- Excluídos gatos já castrados ou com castração agendada",
        tags = {"Gatos"}
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Estatísticas de castração retornadas com sucesso",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = SterilizationStatsDto.class)
            )
        ),
        @ApiResponse(
            responseCode = "500",
            description = "Erro interno do servidor ao processar a solicitação",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(example = "{ \"error\": \"Internal server error\" }")
            )
        )
    })
    @GetMapping("/sterilization-stats")
    public ResponseEntity<SterilizationStatsDto> getSterilizationStats() {
        try {
            SterilizationStatsDto stats = catService.getSterilizationStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
