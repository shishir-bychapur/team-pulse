"use client";

import { Member } from "@/src/types/member";
import Card from "../card/card";
import { useRouter } from "next/navigation";

export function AllMembers({ members }: { members: Member[] }) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {members.map((member) => (
        <Card
          key={member.id}
          title={member.name}
          description={member.role.name}
          onClick={() => {
            router.push(`/members/${member.id}`);
          }}
        />
      ))}
    </div>
  );
}
