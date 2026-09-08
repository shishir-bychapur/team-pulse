-- =========================
-- ROLES
-- =========================

INSERT INTO "Role" ("id", "name")
VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Developer'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Designer'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Manager');


-- =========================
-- MEMBERS
-- =========================

INSERT INTO "Member" ("id", "name", "roleId", "timezone")
VALUES
  (
    '660e8400-e29b-41d4-a716-446655440001',
    'Tom',
    '550e8400-e29b-41d4-a716-446655440001',
    'UTC'
  ),
  (
    '660e8400-e29b-41d4-a716-446655440002',
    'Harry',
    '550e8400-e29b-41d4-a716-446655440002',
    'UTC'
  ),
  (
    '660e8400-e29b-41d4-a716-446655440003',
    'Dominic',
    '550e8400-e29b-41d4-a716-446655440003',
    'UTC'
  ),
  (
    '660e8400-e29b-41d4-a716-446655440004',
    'Paul',
    '550e8400-e29b-41d4-a716-446655440001',
    'UTC'
  ),
  (
    '660e8400-e29b-41d4-a716-446655440005',
    'Joel',
    '550e8400-e29b-41d4-a716-446655440003',
    'UTC'
  );


-- =========================
-- UPDATES
-- =========================

INSERT INTO "Update" ("id", "memberId", "date", "text", "mood")
VALUES
  (
    '770e8400-e29b-41d4-a716-446655440001',
    '660e8400-e29b-41d4-a716-446655440001',
    '2026-09-01',
    'Completed the new feature implementation.',
    'GREEN'
  ),
  (
    '770e8400-e29b-41d4-a716-446655440002',
    '660e8400-e29b-41d4-a716-446655440002',
    '2026-09-02',
    'Faced some challenges with the design.',
    'YELLOW'
  ),
  (
    '770e8400-e29b-41d4-a716-446655440003',
    '660e8400-e29b-41d4-a716-446655440003',
    '2026-09-03',
    'Had a productive meeting with the team.',
    'GREEN'
  ),
  (
    '770e8400-e29b-41d4-a716-446655440004',
    '660e8400-e29b-41d4-a716-446655440001',
    '2026-09-04',
    'Encountered a critical bug in the system.',
    'RED'
  ),
  (
    '770e8400-e29b-41d4-a716-446655440005',
    '660e8400-e29b-41d4-a716-446655440001',
    '2026-09-05',
    'Successfully resolved the bug.',
    'GREEN'
  );


-- =========================
-- ACTION ITEMS
-- =========================

INSERT INTO "ActionItem" ("id", "title", "ownerId", "status", "dueDate")
VALUES
  (
    '880e8400-e29b-41d4-a716-446655440001',
    'Setup CI/CD pipeline',
    '660e8400-e29b-41d4-a716-446655440001',
    'OPEN',
    '2026-09-15'
  ),
  (
    '880e8400-e29b-41d4-a716-446655440002',
    'Design main dashboard wireframes',
    '660e8400-e29b-41d4-a716-446655440002',
    'OPEN',
    '2026-09-10'
  ),
  (
    '880e8400-e29b-41d4-a716-446655440003',
    'Conduct Q3 sprint planning',
    '660e8400-e29b-41d4-a716-446655440003',
    'CLOSED',
    '2026-08-30'
  ),
  (
    '880e8400-e29b-41d4-a716-446655440004',
    'Fix authentication token refresh bug',
    '660e8400-e29b-41d4-a716-446655440004',
    'OPEN',
    '2026-09-08'
  ),
  (
    '880e8400-e29b-41d4-a716-446655440005',
    'Review Q4 budget allocation',
    '660e8400-e29b-41d4-a716-446655440005',
    'CLOSED',
    '2026-08-25'
  ),
  (
    '880e8400-e29b-41d4-a716-446655440006',
    'Update component library documentation',
    '660e8400-e29b-41d4-a716-446655440002',
    'OPEN',
    '2026-09-20'
  );