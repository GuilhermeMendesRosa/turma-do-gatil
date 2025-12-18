package br.com.udesc.turma_do_gatil_back.services;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class SecurityService {

    public String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            return "system";
        }

        String principal = authentication.getName();

        if ("anonymousUser".equals(principal)) {
            return "system";
        }

        return principal;
    }
}
