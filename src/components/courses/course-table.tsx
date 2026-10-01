import { ConfirmDeleteButton } from "@/components/confirm-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEnrollmentStore } from "@/lib/enrollment-store";

import { Badge } from "@/components/ui/badge";

import { semesterOptions } from "@/lib/schemas/course-schema";
const semesterLabel = (value : string | undefined) => {
  const option = value ? semesterOptions.find((s) => s.value === value) : null;
  return (option ? option.label: value); 
};

export function CourseTable() {
  const courses = useEnrollmentStore((s) => s.courses);
  const removeCourse = useEnrollmentStore((s) => s.removeCourse);

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>รหัสวิชา</TableHead>
            <TableHead>ชื่อวิชา</TableHead>
            <TableHead>หลักสูตร</TableHead>
            <TableHead>ภาคการศึกษา</TableHead>
            <TableHead>รายละเอียด</TableHead>
            <TableHead>ผู้สอน</TableHead>
            <TableHead>รับข่าวสารทางอีเมล</TableHead>
            <TableHead className="w-20">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.length === 0 && (
            <TableRow>
              <TableCell
                className="h-20 text-center text-muted-foreground"
              >
                ยังไม่มีวิชาที่เปิดสอน
              </TableCell>
            </TableRow>
          )}
          {courses.map((course) => (
            <TableRow key={course.courseId}>
              <TableCell>{course.courseId}</TableCell>
              <TableCell className="whitespace-normal">{course.courseTitle}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  >
                  {course.program}
                </Badge>
              </TableCell>
              <TableCell>{semesterLabel(course.semester)}</TableCell>
              <TableCell>
                <span className="text-muted-foreground">
                {course.description? course.description: "—"}
                </span>
              </TableCell>
              <TableCell>
                {course.instructors.length === 0 ? (
                  <span className="text-muted-foreground">ยังไม่มีผู้สอน</span>
                ) : (
                      course.instructors.map((i) => {
                      return (
                        <div>
                          <div>{i.name}</div>
                          <div className="text-muted-foreground">{i.email}</div>
                        </div>
                      );
                    })
                  
                )}
              </TableCell>
              <TableCell>
              {course.notifyByEmail 
              ? <Badge
                  >
                    รับ
                </Badge> 
              : <Badge
                  variant="secondary"
                  >
                    ไม่รับ
                </Badge>
              }  
              </TableCell>
              <TableCell>
                <ConfirmDeleteButton
                  label={`ลบวิชา ${course.courseId}`}
                  title="ลบวิชา?"
                  description={`ลบ ${course.courseId} — ${course.courseTitle} ออกจากรายวิชาที่เปิดสอน พร้อมการลงทะเบียนทั้งหมดของวิชานี้`}
                  onConfirm={() => removeCourse(course.courseId)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
