package com.example.techstore.config;

import org.springframework.boot.autoconfigure.orm.jpa.EntityManagerFactoryDependsOnPostProcessor;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JpaDependsOnConfig extends EntityManagerFactoryDependsOnPostProcessor {
    public JpaDependsOnConfig() {
        super("databaseMigrationRunner");
    }
}
