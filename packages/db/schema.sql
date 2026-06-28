CREATE TABLE IF NOT EXISTS admins (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS class_rooms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  section TEXT NOT NULL,
  UNIQUE(name, section)
);

CREATE TABLE IF NOT EXISTS teachers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS teacher_classes (
  id TEXT PRIMARY KEY,
  teacher_id TEXT NOT NULL REFERENCES teachers(id),
  class_room_id TEXT NOT NULL REFERENCES class_rooms(id),
  UNIQUE(teacher_id, class_room_id)
);

CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  student_code TEXT NOT NULL UNIQUE,
  blood_group TEXT,
  father_name TEXT,
  mother_name TEXT,
  address TEXT,
  father_phone TEXT,
  mother_phone TEXT,
  class_room_id TEXT NOT NULL REFERENCES class_rooms(id),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS homework (
  id TEXT PRIMARY KEY,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  due_date TEXT,
  attachment_url TEXT,
  teacher_id TEXT NOT NULL REFERENCES teachers(id),
  class_room_id TEXT NOT NULL REFERENCES class_rooms(id),
  sent_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS homework_reads (
  id TEXT PRIMARY KEY,
  homework_id TEXT NOT NULL REFERENCES homework(id),
  student_id TEXT NOT NULL REFERENCES students(id),
  status TEXT NOT NULL DEFAULT 'SENT',
  viewed_at TEXT,
  completed_at TEXT,
  UNIQUE(homework_id, student_id)
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id TEXT PRIMARY KEY,
  teacher_id TEXT NOT NULL REFERENCES teachers(id),
  student_id TEXT NOT NULL REFERENCES students(id),
  sender TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  read_at TEXT
);

CREATE TABLE IF NOT EXISTS otp_codes (
  id TEXT PRIMARY KEY,
  mobile TEXT NOT NULL,
  code TEXT NOT NULL,
  role TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  verified INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
