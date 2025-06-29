import { getMontLedger, getWalletMember } from "@/actions/member.action";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MonthChoice from "@/components/WalletPage/group/month-choice";
import NavbarGroup from "@/components/WalletPage/group/NavbarGroup";
import PaidComponent from "@/components/WalletPage/group/PaidComponent";
import TableTransactin from "@/components/WalletPage/group/TableTransactin";
import { getTransaltion } from "@/language/getTranslation";
import { parse } from "date-fns";
import React from "react";

export default async function WalletGroup({
  params: getParams,
  searchParams: getSearch,
}: {
  params: Promise<{ wallet_id: string }>;
  searchParams?: Promise<{
    date?: string;
  }>;
}) {
  const params = await getParams;
  const searchParams = await getSearch;
  const query = searchParams?.date;
  const lang = await getTransaltion();

  const monthLedger = await getMontLedger(String(params.wallet_id));

  const newDate = query ? parse(query, "yyyy-MM", new Date()) : new Date();
  const data = await getWalletMember(String(params.wallet_id), newDate);
  const user = data.results?.users;

  return (
    <div className="min-h-screen md:px-2 px-4 pb-10">
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
                      {lang.group_wallet.piutang}
                    </p>
                    <p className="self-start text-red-900 font-medium">
                      {lang.group_wallet.utang}
                    </p>
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
            {user?.map((rowUser) => {
              return (
                <TableRow className="border-black" key={rowUser.id}>
                  <TableCell className="border-r border-black">
                    {rowUser.name}
                  </TableCell>
                  {user.map((colUser) => {
                    const totalAmount = data.results?.fromLedger
                      .filter(
                        (l) =>
                          l.fromId === colUser.id &&
                          l.toId === rowUser.id &&
                          l.status === "unpaid"
                      )
                      .reduce((sum, l) => sum + l.amount, 0);
                    return (
                      <TableCell
                        className="border-black border-r"
                        key={colUser.id}
                      >
                        Rp{" "}
                        {(totalAmount ?? 0) > 1
                          ? (totalAmount ?? 0).toLocaleString("id-ID")
                          : "-"}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <PaidComponent users={user ?? []} />

        <MonthChoice data={monthLedger?.results ?? []} newDate={newDate} />

        <TableTransactin data={data.results?.fromLedger ?? []} />
      </div>
    </div>
  );
}
