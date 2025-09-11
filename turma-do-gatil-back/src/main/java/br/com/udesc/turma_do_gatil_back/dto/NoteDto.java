package br.com.udesc.turma_do_gatil_back.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NoteDto {
    private UUID id;
    private UUID catId;
    private LocalDateTime date;
    private String text;
}
