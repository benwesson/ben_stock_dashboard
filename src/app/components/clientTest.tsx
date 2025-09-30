"use client";

export default function ClientComponent({ children }: any) {
  const data = children.props;
  return (
    <>
      <h1>Client</h1>
      {data}
    </>
  );
}
