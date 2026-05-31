package de.botpilot.faqs.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Application entry point.
 *
 * <p>The {@code @SpringBootApplication} annotation is intentionally placed here,
 * in the assembler module, and nowhere else.  Every other module is framework-agnostic
 * (or uses only thin Spring annotations like {@code @RestController}).
 *
 * <p>Component scanning starts from this package ({@code de.botpilot.faqs.app}) and
 * must be extended to cover sibling packages.  The explicit {@code scanBasePackages}
 * attribute ensures Spring finds beans in all sub-modules without relying on the
 * implicit "same-or-sub-package" rule, which would miss sibling packages.
 */
@SpringBootApplication(scanBasePackages = "de.botpilot.faqs")
public class BotPilotFaqsApplication {

    public static void main(String[] args) {
        SpringApplication.run(BotPilotFaqsApplication.class, args);
    }
}
