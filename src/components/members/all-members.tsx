"use client";

import { Member } from "@/src/types/member";
import { useState, useEffect } from "react";
import Card from "../card";

export function AllMembers() {
  const [data, setData] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/members");
        const data = await response.json();
        setData(data.members);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching members:", error);
        setError("Failed to fetch members");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Members not found. Please try again later.</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {data.map((member, index) => (
        <Card key={index} title={member.name} description={member.role.name} />
      ))}
    </div>
  );
}
