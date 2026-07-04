import { randomUUID } from "crypto";
import { db } from "./client";

export type UserRole = "ADMIN" | "TEACHER" | "STUDENT";
export type HomeworkStatus = "SENT" | "VIEWED" | "COMPLETED";
export type ChatSender = "TEACHER" | "STUDENT";

export type Admin = { id: string; name: string; mobile: string; created_at: string };
export type ClassRoom = { id: string; name: string; section: string };
export type Teacher = { id: string; name: string; mobile: string; created_at: string };
export type Student = {
  id: string;
  name: string;
  student_code: string;
  blood_group: string | null;
  father_name: string | null;
  mother_name: string | null;
  address: string | null;
  father_phone: string | null;
  mother_phone: string | null;
  class_room_id: string;
  created_at: string;
};
export type Homework = {
  id: string;
  subject: string;
  description: string;
  due_date: string | null;
  attachment_url: string | null;
  teacher_id: string;
  class_room_id: string;
  sent_at: string;
};
export type HomeworkRead = {
  id: string;
  homework_id: string;
  student_id: string;
  status: HomeworkStatus;
  viewed_at: string | null;
  completed_at: string | null;
};
export type ChatMessage = {
  id: string;
  teacher_id: string;
  student_id: string;
  sender: ChatSender;
  message: string;
  created_at: string;
  read_at: string | null;
};

export { db };

// ---------- Admin ----------
export const Admins = {
  findByMobile: (mobile: string): Admin | undefined =>
    db.prepare("SELECT * FROM admins WHERE mobile = ?").get(mobile) as Admin | undefined,
  create: (name: string, mobile: string): Admin => {
    const id = randomUUID();
    db.prepare("INSERT INTO admins (id, name, mobile) VALUES (?, ?, ?)").run(id, name, mobile);
    return Admins.findByMobile(mobile)!;
  },
  count: (): number => (db.prepare("SELECT COUNT(*) as c FROM admins").get() as { c: number }).c,
};

// ---------- ClassRoom ----------
export const ClassRooms = {
  list: (): ClassRoom[] => db.prepare("SELECT * FROM class_rooms ORDER BY name, section").all() as ClassRoom[],
  findById: (id: string): ClassRoom | undefined =>
    db.prepare("SELECT * FROM class_rooms WHERE id = ?").get(id) as ClassRoom | undefined,
  create: (name: string, section: string): ClassRoom => {
    const id = randomUUID();
    db.prepare("INSERT INTO class_rooms (id, name, section) VALUES (?, ?, ?)").run(id, name, section);
    return ClassRooms.findById(id)!;
  },
};

// ---------- Teacher ----------
export const Teachers = {
  findByMobile: (mobile: string): Teacher | undefined =>
    db.prepare("SELECT * FROM teachers WHERE mobile = ?").get(mobile) as Teacher | undefined,
  findById: (id: string): Teacher | undefined =>
    db.prepare("SELECT * FROM teachers WHERE id = ?").get(id) as Teacher | undefined,
  list: (): Teacher[] => db.prepare("SELECT * FROM teachers ORDER BY name").all() as Teacher[],
  create: (name: string, mobile: string): Teacher => {
    const id = randomUUID();
    db.prepare("INSERT INTO teachers (id, name, mobile) VALUES (?, ?, ?)").run(id, name, mobile);
    return Teachers.findById(id)!;
  },
  assignClass: (teacherId: string, classRoomId: string) => {
    const id = randomUUID();
    db.prepare(
      "INSERT OR IGNORE INTO teacher_classes (id, teacher_id, class_room_id) VALUES (?, ?, ?)"
    ).run(id, teacherId, classRoomId);
  },
  classesFor: (teacherId: string): ClassRoom[] =>
    db
      .prepare(
        `SELECT cr.* FROM class_rooms cr
         JOIN teacher_classes tc ON tc.class_room_id = cr.id
         WHERE tc.teacher_id = ? ORDER BY cr.name, cr.section`
      )
      .all(teacherId) as ClassRoom[],
  isAssignedToClass: (teacherId: string, classRoomId: string): boolean =>
    !!db
      .prepare("SELECT 1 FROM teacher_classes WHERE teacher_id = ? AND class_room_id = ?")
      .get(teacherId, classRoomId),
};

// ---------- Student ----------
export const Students = {
  findByPhone: (phone: string): Student | undefined =>
    db
      .prepare("SELECT * FROM students WHERE father_phone = ? OR mother_phone = ?")
      .get(phone, phone) as Student | undefined,
  findById: (id: string): Student | undefined =>
    db.prepare("SELECT * FROM students WHERE id = ?").get(id) as Student | undefined,
  listByClass: (classRoomId: string): Student[] =>
    db.prepare("SELECT * FROM students WHERE class_room_id = ? ORDER BY name").all(classRoomId) as Student[],
  create: (data: Omit<Student, "id" | "created_at">): Student => {
    const id = randomUUID();
    db.prepare(
      `INSERT INTO students
       (id, name, student_code, blood_group, father_name, mother_name, address, father_phone, mother_phone, class_room_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      id,
      data.name,
      data.student_code,
      data.blood_group,
      data.father_name,
      data.mother_name,
      data.address,
      data.father_phone,
      data.mother_phone,
      data.class_room_id
    );
    return Students.findById(id)!;
  },
};

// ---------- Homework ----------
export const HomeworkRepo = {
  create: (data: {
    subject: string;
    description: string;
    dueDate?: string | null;
    attachmentUrl?: string | null;
    teacherId: string;
    classRoomId: string;
  }): Homework => {
    const id = randomUUID();
    db.prepare(
      `INSERT INTO homework (id, subject, description, due_date, attachment_url, teacher_id, class_room_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(
      id,
      data.subject,
      data.description,
      data.dueDate ?? null,
      data.attachmentUrl ?? null,
      data.teacherId,
      data.classRoomId
    );

    const students = Students.listByClass(data.classRoomId);
    const insertRead = db.prepare(
      "INSERT INTO homework_reads (id, homework_id, student_id, status) VALUES (?, ?, ?, 'SENT')"
    );
    for (const s of students) insertRead.run(randomUUID(), id, s.id);

    return db.prepare("SELECT * FROM homework WHERE id = ?").get(id) as Homework;
  },
  findById: (id: string): Homework | undefined =>
    db.prepare("SELECT * FROM homework WHERE id = ?").get(id) as Homework | undefined,
  listByClass: (classRoomId: string): Homework[] =>
    db
      .prepare("SELECT * FROM homework WHERE class_room_id = ? ORDER BY sent_at DESC")
      .all(classRoomId) as Homework[],
  listByTeacher: (teacherId: string): Homework[] =>
    db
      .prepare("SELECT * FROM homework WHERE teacher_id = ? ORDER BY sent_at DESC")
      .all(teacherId) as Homework[],
  listAll: (): Homework[] => db.prepare("SELECT * FROM homework ORDER BY sent_at DESC").all() as Homework[],
  stats: (homeworkId: string) => {
    const rows = db
      .prepare("SELECT status FROM homework_reads WHERE homework_id = ?")
      .all(homeworkId) as { status: HomeworkStatus }[];
    const total = rows.length;
    const completed = rows.filter((r) => r.status === "COMPLETED").length;
    const viewed = rows.filter((r) => r.status === "VIEWED").length;
    const notViewed = rows.filter((r) => r.status === "SENT").length;
    return { total, completed, viewed, notViewed };
  },
  readsFor: (homeworkId: string) =>
    db
      .prepare(
        `SELECT hr.*, s.name as student_name FROM homework_reads hr
         JOIN students s ON s.id = hr.student_id
         WHERE hr.homework_id = ? ORDER BY s.name`
      )
      .all(homeworkId) as (HomeworkRead & { student_name: string })[],
};

export const HomeworkReads = {
  forStudent: (studentId: string): (HomeworkRead & Homework)[] =>
    db
      .prepare(
        `SELECT hr.*, h.subject, h.description, h.due_date, h.attachment_url, h.teacher_id, h.class_room_id, h.sent_at
         FROM homework_reads hr
         JOIN homework h ON h.id = hr.homework_id
         WHERE hr.student_id = ? ORDER BY h.sent_at DESC`
      )
      .all(studentId) as (HomeworkRead & Homework)[],
  markViewed: (homeworkId: string, studentId: string) => {
    db.prepare(
      `UPDATE homework_reads SET status = CASE WHEN status = 'SENT' THEN 'VIEWED' ELSE status END,
       viewed_at = COALESCE(viewed_at, datetime('now'))
       WHERE homework_id = ? AND student_id = ?`
    ).run(homeworkId, studentId);
  },
  markCompleted: (homeworkId: string, studentId: string) => {
    db.prepare(
      `UPDATE homework_reads SET status = 'COMPLETED', completed_at = datetime('now')
       WHERE homework_id = ? AND student_id = ?`
    ).run(homeworkId, studentId);
  },
};

// ---------- Chat ----------
export const ChatMessages = {
  create: (teacherId: string, studentId: string, sender: ChatSender, message: string): ChatMessage => {
    const id = randomUUID();
    db.prepare(
      "INSERT INTO chat_messages (id, teacher_id, student_id, sender, message) VALUES (?, ?, ?, ?, ?)"
    ).run(id, teacherId, studentId, sender, message);
    return db.prepare("SELECT * FROM chat_messages WHERE id = ?").get(id) as ChatMessage;
  },
  forStudentTeacher: (studentId: string, teacherId: string): ChatMessage[] =>
    db
      .prepare(
        "SELECT * FROM chat_messages WHERE student_id = ? AND teacher_id = ? ORDER BY created_at ASC"
      )
      .all(studentId, teacherId) as ChatMessage[],
  threadsForTeacher: (teacherId: string) =>
    db
      .prepare(
        `SELECT s.id as student_id, s.name as student_name,
                MAX(cm.created_at) as last_at,
                SUM(CASE WHEN cm.sender = 'STUDENT' AND cm.read_at IS NULL THEN 1 ELSE 0 END) as unread
         FROM chat_messages cm
         JOIN students s ON s.id = cm.student_id
         WHERE cm.teacher_id = ?
         GROUP BY s.id ORDER BY last_at DESC`
      )
      .all(teacherId) as { student_id: string; student_name: string; last_at: string; unread: number }[],
  markReadForTeacher: (studentId: string, teacherId: string) => {
    db.prepare(
      `UPDATE chat_messages SET read_at = datetime('now')
       WHERE student_id = ? AND teacher_id = ? AND sender = 'STUDENT' AND read_at IS NULL`
    ).run(studentId, teacherId);
  },
  allForAdmin: () =>
    db
      .prepare(
        `SELECT cm.*, s.name as student_name, t.name as teacher_name FROM chat_messages cm
         JOIN students s ON s.id = cm.student_id
         JOIN teachers t ON t.id = cm.teacher_id
         ORDER BY cm.created_at DESC`
      )
      .all() as (ChatMessage & { student_name: string; teacher_name: string })[],
};

// ---------- OTP ----------
export const OtpCodes = {
  create: (mobile: string, code: string, role: UserRole, expiresAt: string) => {
    const id = randomUUID();
    db.prepare(
      "INSERT INTO otp_codes (id, mobile, code, role, expires_at) VALUES (?, ?, ?, ?, ?)"
    ).run(id, mobile, code, role, expiresAt);
  },
  latestUnverified: (mobile: string, code: string, role: UserRole) =>
    db
      .prepare(
        `SELECT * FROM otp_codes WHERE mobile = ? AND code = ? AND role = ? AND verified = 0
         ORDER BY created_at DESC LIMIT 1`
      )
      .get(mobile, code, role) as { id: string; expires_at: string } | undefined,
  markVerified: (id: string) => db.prepare("UPDATE otp_codes SET verified = 1 WHERE id = ?").run(id),
};

// ---------- Push subscriptions ----------
export const PushSubscriptions = {
  upsert: (userId: string, role: UserRole, endpoint: string, p256dh: string, auth: string) => {
    const id = randomUUID();
    db.prepare(
      `INSERT INTO push_subscriptions (id, user_id, role, endpoint, p256dh, auth) VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(endpoint) DO UPDATE SET p256dh = excluded.p256dh, auth = excluded.auth`
    ).run(id, userId, role, endpoint, p256dh, auth);
  },
  listForUser: (userId: string) =>
    db.prepare("SELECT * FROM push_subscriptions WHERE user_id = ?").all(userId) as {
      endpoint: string;
      p256dh: string;
      auth: string;
    }[],
};
