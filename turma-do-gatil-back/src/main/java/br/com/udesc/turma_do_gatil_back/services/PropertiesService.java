package br.com.udesc.turma_do_gatil_back.services;

import br.com.udesc.turma_do_gatil_back.entities.Properties;
import br.com.udesc.turma_do_gatil_back.repositories.PropertiesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PropertiesService {

    private final PropertiesRepository propertiesRepository;

    public String getProperty(String key) {
        return propertiesRepository.findById(key).map(Properties::getValue).orElse(null);
    }

    public void setProperty(String key, String value) {
        Properties prop = new Properties(key, value);
        propertiesRepository.save(prop);
    }

    public int getMinimumSterilizationAgeDays() {
        String value = getProperty("sterilizationMinDays");
        return value != null ? Integer.parseInt(value) : 90;
    }

    public int getOverdueSterilizationAgeDays() {
        String value = getProperty("sterilizationMaxDays");
        return value != null ? Integer.parseInt(value) : 180;
    }
}
