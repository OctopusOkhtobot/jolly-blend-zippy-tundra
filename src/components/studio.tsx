import { useEffect } from "react";
import { useRoom } from "@/lib/classroom";
import { Toast } from "@/components/bits";
import { LoginScreen } from "@/components/login-screen";
import { StudentView } from "@/components/student-view";
import { TeacherView } from "@/components/teacher-view";

export function Studio() {
  const ready = useRoom((state) => state.ready);
  const me = useRoom((state) => state.me);
  const boot = useRoom((state) => state.boot);

  useEffect(() => {
    void boot();
  }, [boot]);

  return (
    <>
      {!ready || !me ? <LoginScreen /> : me.role === "sup" ? <TeacherView /> : <StudentView />}
      <Toast />
    </>
  );
}
