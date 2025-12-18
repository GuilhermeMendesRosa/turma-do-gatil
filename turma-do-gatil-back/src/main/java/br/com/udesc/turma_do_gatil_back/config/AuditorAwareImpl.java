package br.com.udesc.turma_do_gatil_back.config;

import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component("auditorAware")
public class AuditorAwareImpl implements AuditorAware<String> {

    @Override
    public Optional<String> getCurrentAuditor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.of("system");
        }

        String principal = authentication.getName();
        
        // Se for anonymous, retorna system
        if ("anonymousUser".equals(principal)) {
            return Optional.of("system");
        }

        return Optional.of(principal);
    }
}
