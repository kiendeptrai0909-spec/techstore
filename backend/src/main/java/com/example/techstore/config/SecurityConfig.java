package com.example.techstore.config;

import com.example.techstore.security.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.time.LocalDateTime;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) -> {
                            writeSecurityErrorResponse(
                                    response,
                                    HttpStatus.UNAUTHORIZED,
                                    "Bạn cần đăng nhập để truy cập tài nguyên này",
                                    request.getRequestURI()
                            );
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            writeSecurityErrorResponse(
                                    response,
                                    HttpStatus.FORBIDDEN,
                                    "Bạn không có quyền truy cập tài nguyên này",
                                    request.getRequestURI()
                            );
                        })
                )

                .authorizeHttpRequests(auth -> auth
                        // Public auth APIs
                        .requestMatchers(
                                "/api/v1/auth/register",
                                "/api/v1/auth/login",
                                "/error"
                        ).permitAll()

                        // Public GET APIs
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/v1/categories",
                                "/api/v1/categories/**",
                                "/api/v1/brands",
                                "/api/v1/brands/**",
                                "/api/v1/products",
                                "/api/v1/products/**",
                                "/api/v1/banners",
                                "/api/v1/banners/**",
                                "/api/v1/faqs",
                                "/api/v1/faqs/**",
                                "/api/v1/coupons/validate"
                        ).permitAll()

                        // Swagger
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs/**"
                        ).permitAll()

                        // Admin APIs
                        .requestMatchers("/api/v1/admin/**").hasAuthority("ROLE_ADMIN")
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/v1/contact-messages"
                        ).permitAll()
                        // Other APIs require login
                        .anyRequest().authenticated()
                )

                .authenticationProvider(authenticationProvider())

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                )

                .build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration
    ) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    private void writeSecurityErrorResponse(
            HttpServletResponse response,
            HttpStatus status,
            String message,
            String path
    ) throws java.io.IOException {
        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        String json = """
                {
                  "status": %d,
                  "error": "%s",
                  "message": "%s",
                  "path": "%s",
                  "timestamp": "%s"
                }
                """.formatted(
                status.value(),
                status.getReasonPhrase(),
                message,
                path,
                LocalDateTime.now()
        );

        response.getWriter().write(json);
    }
}