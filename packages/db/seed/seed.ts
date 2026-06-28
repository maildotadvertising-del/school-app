import { Admins, ClassRooms, Teachers, Students } from "../index";

function main() {
  if (Admins.count() === 0) {
    Admins.create("Sabeez", "9999999999");
    console.log("Seeded admin: Sabeez / 9999999999");
  }

  let classRoom = ClassRooms.list()[0];
  if (!classRoom) {
    classRoom = ClassRooms.create("5", "A");
    console.log("Seeded class room: 5-A");
  }

  let teacher = Teachers.list()[0];
  if (!teacher) {
    teacher = Teachers.create("Demo Teacher", "8888888888");
    Teachers.assignClass(teacher.id, classRoom.id);
    console.log("Seeded teacher: Demo Teacher / 8888888888 (assigned to 5-A)");
  }

  const students = Students.listByClass(classRoom.id);
  if (students.length === 0) {
    Students.create({
      name: "Demo Student",
      student_code: "STU001",
      blood_group: "O+",
      father_name: "Father Name",
      mother_name: "Mother Name",
      address: "Sample Address",
      father_phone: "7777777777",
      mother_phone: "6666666666",
      class_room_id: classRoom.id,
    });
    console.log("Seeded student: Demo Student / 7777777777 (parent phone)");
  }

  console.log("Seed complete.");
}

main();
