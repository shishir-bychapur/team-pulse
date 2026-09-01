"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import { Member } from "@/src/types/member";
import SkeletonLoader from "../skeleton-loader";
import Alert from "../alert";

export default function SingleMember() {
  const { id } = useParams();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await fetch(`/api/members/${id}`);
        const data = await response.json();
        setMember(data.member);
      } catch (error) {
        console.error("Error fetching member:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  if (loading) {
    return <SkeletonLoader />;
  }

  if (!member) {
    return (
      <Alert
        title="Member not found!"
        message="The requested member could not be found."
      />
    );
  }

  return (
    <div className="mx-2">
      <h2 className="text-xl font-semibold">Name: {member.name}</h2>
      <p className="text-lg text-gray-600">Role: {member.role.name}</p>
      <p className="text-gray-700">Timezone: {member.timezone}</p>
    </div>
  );
}
