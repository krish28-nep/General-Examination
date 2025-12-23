'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import logo from '@/public/omexLogo.png'
import { Program } from '@/types/program';
import { useQuery } from '@tanstack/react-query';
import { fetchPrograms } from '@/lib/api/program';

const Footer = () => {

  const { data: programsData = [] } = useQuery<Program[]>({
    queryKey: ["programs"],
    queryFn: fetchPrograms,
  });
  return (
    <footer className="text-neutral-light bg-neutral pb-16">
      <div className="content-wrapper grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-16 lg:grid-cols-4">

        {/* col 1 */}
        <div className="flex flex-col items-start gap-4">
          <div className="h-16 overflow-clip">
            <Image
              src={logo}
              height={200}
              width={400}
              alt="THE OMEX LOGO"
              className="h-full w-auto object-contain"
            />
          </div>
          <p className="text-sm">OERS — Online Examination Registration System.</p>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-neutral-lightest text-xl font-semibold">Contact Us</h2>
          <div className="flex flex-col gap-2 text-sm leading-relaxed">
            <p className="font-medium">Tribhuvan University</p>
            <p>Kirtipur, Kathmandu, Nepal</p>
            <p>Registrar Office Phone: <span className="font-medium">+977-1-4330436</span></p>
            <p>Vice Chancellor Office Phone: <span className="font-medium">+977-1-4330433</span></p>
            <p>Email: <span className="font-medium">registraroffice@tu.edu.np</span></p>
            <p className="text-neutral-light hover:text-neutral-lightest transition">
              <Link href="https://tu.edu.np" target="_blank">www.tu.edu.np</Link>
            </p>
          </div>
        </div>

        {/* col 3 — Programs */}
        <div className="flex flex-col gap-4">
          <h2 className="text-neutral-lightest text-xl font-semibold">Programs</h2>
          <div className="flex flex-col gap-2 text-sm">
            {programsData.length > 0 ? (
              programsData.map((program) => (
                <Link
                  key={program.id}
                  href={`/programs/${program.id}`}
                  className="hover:text-neutral-lightest transition"
                >
                  {program.name}
                </Link>
              ))
            ) : (
              <p className="text-neutral-light/70">No Programs Available</p>
            )}
          </div>
        </div>


      </div>

      <hr />

      <div className="content-wrapper text-neutral-lightest/60 flex flex-wrap items-center justify-center gap-4 py-4 md:justify-between">
        <span className="text-sm">© {new Date().getFullYear()} OERS. All rights reserved.</span>
        <div className="flex gap-4 text-sm">
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-and-conditions">Terms and Conditions</Link>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
