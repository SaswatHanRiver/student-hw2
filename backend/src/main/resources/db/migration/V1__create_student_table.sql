-- Students table. Rules here match the Bean Validation rules in CreateStudentRequest.
CREATE TABLE student (
    id                 BIGSERIAL    PRIMARY KEY,
    student_code       VARCHAR(12)  NOT NULL,
    full_name          VARCHAR(50)  NOT NULL,
    email              VARCHAR(100) NOT NULL,
    grade              INTEGER      NOT NULL CHECK (grade BETWEEN 6 AND 10),
    joined_on          DATE         NOT NULL,
    attendance_percent INTEGER      NOT NULL CHECK (attendance_percent BETWEEN 0 AND 100),
    status             VARCHAR(20)  NOT NULL CHECK (status IN ('ACTIVE', 'ON_LEAVE', 'GRADUATED')),
    created_at         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at         TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT uk_student_code  UNIQUE (student_code),
    CONSTRAINT uk_student_email UNIQUE (email)
);

CREATE INDEX idx_student_status ON student (status);
CREATE INDEX idx_student_grade  ON student (grade);
