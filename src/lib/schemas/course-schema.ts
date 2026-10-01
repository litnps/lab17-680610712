import { z } from "zod";

import type { Course } from "@/lib/types";


export const MAX_COURSE_TITLE = 100;
export const MAX_COURSE_DESCRIPTION = 100;

export const MAX_INSTRUCTORS = 3;

export const semesterOptions = [
  { value: "1", label: "ภาคการศึกษาที่ 1" },
  { value: "2", label: "ภาคการศึกษาที่ 2" },
  { value: "3", label: "ภาคฤดูร้อน" },
];

export const programOptions = [
  { value: "CPE", label: "CPE - วิศวกรรมคอมพิวเตอร์" },
  { value: "ISNE", label: "ISNE - วิศวกรรมระบบสารสนเทศและเครือข่าย" },
];

export function createCourseFormSchema(existingCourses : Course[]){
    return z.object({
        courseId: z
            .string()
            .trim()
            .regex(/^\d{6}$/, "รหัสวิชาต้องเป็นตัวเลข 6 หลัก")
            .refine((id) => !existingCourses.some((c) => c.courseId === id), "รหัสวิชานี้มีอยู่แล้ว"),

        courseTitle: z
            .string()
            .trim()
            .min(1, "กรอกชื่อวิชา")
            .max(MAX_COURSE_TITLE, `ชื่อวิชายาวได้ไม่เกิน ${MAX_COURSE_TITLE} ตัวอักษร`),
            
        instructors: z
            .array(
                z.object({
                    name: z
                        .string()
                        .trim()
                        .min(1, "กรอกชื่อผู้สอน"),

                    email: z
                        .string()
                        .trim()
                        .email("อีเมลไม่ถูกต้อง")
                        .refine((e) => e.toLowerCase().endsWith("@cmu.ac.th"), "ต้องเป็นอีเมล @cmu.ac.th"),
                }))
            .min(1, "ต้องมีผู้สอนอย่างน้อย 1 คน")
            .max(MAX_INSTRUCTORS, `ต้องมีผู้สอนไม่เกิน ${MAX_INSTRUCTORS} คน`)
            .refine((list) => {
                const emails = list.map((i) => i.email.trim().toLowerCase());
                return new Set(emails).size === emails.length;
            }, "อีเมลผู้สอนซ้ำกัน"),

        program: z
            .enum(["CPE", "ISNE"],
                { error: "เลือกหลักสูตร" }),

        semester: z
            .enum(["1", "2", "3"],
                { error: "เลือกภาคการศึกษา"}),

        description: z
            .string()
            .trim()
            .max(MAX_COURSE_DESCRIPTION, `รายละเอียดยาวได้ไม่เกิน ${MAX_COURSE_DESCRIPTION} ตัวอักษร`),

        notifyByEmail: z.boolean(),
    });
};

export type CourseFormValues = z.infer<ReturnType<typeof createCourseFormSchema>>;