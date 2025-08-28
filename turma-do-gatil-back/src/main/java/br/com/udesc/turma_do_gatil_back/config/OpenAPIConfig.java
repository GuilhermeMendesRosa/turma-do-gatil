package br.com.udesc.turma_do_gatil_back.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenAPIConfig {

    @Bean
    public OpenAPI turmaDoGatilOpenAPI() {
        Server devServer = new Server();
        devServer.setUrl("http://localhost:8080");
        devServer.setDescription("Servidor de Desenvolvimento");

        Server prodServer = new Server();
        prodServer.setUrl("https://api.turmadogatil.com");
        prodServer.setDescription("Servidor de Produção");

        Contact contact = new Contact();
        contact.setEmail("contato@turmadogatil.com");
        contact.setName("Equipe Turma do Gatil");
        contact.setUrl("https://turmadogatil.com");

        License license = new License()
                .name("MIT License")
                .url("https://choosealicense.com/licenses/mit/");

        Info info = new Info()
                .title("Turma do Gatil - API REST")
                .version("1.0.0")
                .contact(contact)
                .description("API REST completa para gerenciamento do sistema Turma do Gatil.\n\n" +
                           "Esta API permite gerenciar:\n" +
                           "- **Gatos**: Cadastro, listagem e gerenciamento de felinos disponíveis para adoção\n" +
                           "- **Adotantes**: Cadastro e gerenciamento de pessoas interessadas em adotar\n" +
                           "- **Adoções**: Processo completo de adoção com diferentes status (PENDING, COMPLETED, CANCELED)\n" +
                           "- **Esterilizações**: Controle do processo de esterilização dos gatos\n" +
                           "- **Anotações**: Sistema de notas e observações sobre gatos e processos\n\n" +
                           "**Principais funcionalidades da API de Adoção:**\n" +
                           "- Criar novo processo de adoção vinculando gato e adotante\n" +
                           "- Acompanhar status da adoção (pendente, concluída, cancelada)\n" +
                           "- Filtrar adoções por diversos critérios\n" +
                           "- Histórico completo de adoções por gato ou adotante")
                .termsOfService("https://turmadogatil.com/terms")
                .license(license);

        // Definindo tags para organizar os endpoints
        Tag catsTag = new Tag()
                .name("Gatos")
                .description("Operações relacionadas ao gerenciamento de gatos");

        Tag adoptersTag = new Tag()
                .name("Adotantes")
                .description("Operações relacionadas ao gerenciamento de adotantes");

        Tag adoptionsTag = new Tag()
                .name("Adoções")
                .description("Operações relacionadas ao processo de adoção. " +
                           "Permite criar, consultar e gerenciar adoções entre gatos e adotantes.");

        Tag sterilizationsTag = new Tag()
                .name("Esterilizações")
                .description("Operações relacionadas ao controle de esterilização dos gatos");

        Tag notesTag = new Tag()
                .name("Anotações")
                .description("Operações relacionadas a anotações e observações");

        return new OpenAPI()
                .info(info)
                .servers(List.of(devServer, prodServer))
                .tags(List.of(catsTag, adoptersTag, adoptionsTag, sterilizationsTag, notesTag));
    }
}
