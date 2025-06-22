import { getWalletMember } from "@/actions/member.action";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import NavbarGroup from "@/components/WalletPage/group/NavbarGroup";
import PaidComponent from "@/components/WalletPage/group/PaidComponent";
import React from "react";

export default async function WalletGroup({
  params: getParams,
}: {
  params: Promise<{ wallet_id: string }>;
}) {
  const params = await getParams;
  const data = await getWalletMember(String(params.wallet_id));
  const user = data.results;

  return (
    <div className="min-h-screen md:px-2 px-4">
      <NavbarGroup params={getParams} />

      <div className="pt-14">
        <Table className="border-black border rounded-2xl">
          <TableHeader>
            <TableRow className="border-black">
              <TableHead className="border-r border-black relative p-0 overflow-hidden w-[100px]">
                <div className="relative w-full h-full">
                  {/* Background Segitiga Piutang (kanan atas) */}
                  <div className="absolute top-0 left-0 w-full h-full z-0">
                    <svg
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                      className="w-full h-full"
                    >
                      <polygon points="0,0 100,0 100,100" fill="#d1fae5" />{" "}
                      {/* Tailwind green-100 */}
                      <polygon points="0,0 0,100 100,100" fill="#fee2e2" />{" "}
                      {/* Tailwind red-100 */}
                    </svg>
                  </div>

                  {/* Garis diagonal */}
                  <svg
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    className="absolute top-0 left-0 w-full h-full z-10"
                  >
                    <line
                      x1="0"
                      y1="0"
                      x2="100"
                      y2="100"
                      stroke="black"
                      strokeWidth="1"
                    />
                  </svg>

                  {/* Label teks */}
                  <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-between text-[12px] leading-none p-[4px] z-20 pointer-events-none">
                    <p className="self-end text-green-900 font-medium">
                      Piutang
                    </p>
                    <p className="self-start text-red-900 font-medium">Utang</p>
                  </div>
                </div>
              </TableHead>

              {user?.map((item) => (
                <TableHead className="border-black border-r" key={item.id}>
                  {item.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {user?.map((item) => {
              return (
                <TableRow className="border-black" key={item.id}>
                  <TableCell className="border-r border-black">
                    {item.name}
                  </TableCell>
                  {Array.from({ length: user.length }).map((_, index) => {
                    return (
                      <TableCell className="border-black border-r" key={index}>
                        Bayar
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <PaidComponent users={user ?? []} />
      </div>
    </div>
  );
}
