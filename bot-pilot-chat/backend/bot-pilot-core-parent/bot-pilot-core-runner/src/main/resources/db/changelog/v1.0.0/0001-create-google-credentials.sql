--liquibase formatted sql

-- Initial table for Google OAuth2 credentials. Column names, types, widths and
-- nullability match the GoogleCalendarCredentials JPA entity (domain module) and the
-- legacy Python SQLAlchemy model exactly. The precondition marks this changeset as
-- already applied (MARK_RAN) if the table exists — defensive guard for environments
-- where the schema was created by the legacy Python service.
--changeset normanboettcher:0001-create-google-credentials
--comment: Initial google_credentials table, matching the GoogleCalendarCredentials JPA entity and the legacy Python SQLAlchemy schema.
--preconditions onFail:MARK_RAN
--precondition-sql-check expectedResult:0 SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'google_credentials'
CREATE TABLE google_credentials (
    calendar_id      VARCHAR(500)  NOT NULL,
    customer_context VARCHAR(500)  NOT NULL,
    client_id        VARCHAR(500)  NOT NULL,
    client_secret    VARCHAR(500)  NOT NULL,
    access_token     VARCHAR(2500) NOT NULL,
    refresh_token    VARCHAR(2500) NOT NULL,
    token_uri        VARCHAR(1000) NOT NULL,
    expiry           DATETIME      NULL,
    scopes           VARCHAR(1000) NULL,
    CONSTRAINT pk_google_credentials PRIMARY KEY (calendar_id)
);
--rollback DROP TABLE google_credentials;
