package br.com.udesc.turma_do_gatil_back.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Turma do Gatil - API")
                        .description("API REST para gerenciamento do sistema Turma do Gatil - Sistema de adoção de gatos")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Equipe Turma do Gatil")
                                .email("contato@turmadogatil.com"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://choosealicense.com/licenses/mit/")))
                .servers(List.of(
                        new Server()
                                .url("https://turma-do-gatil-production.up.railway.app")
                                .description("Servidor de Desenvolvimento")
                ));
    }
}
