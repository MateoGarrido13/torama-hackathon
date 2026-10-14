"use client";

import { useEffect, useState } from "react";
import { event, navItems } from "@/content/evento";
import { Icon } from "@/components/icon";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="navbar">
      <a className="brand" href="#inicio" aria-label={`${event.name}, inicio`}>
        <span className="brand__mark">TT</span>
        <span>
          Tandil
          <br />
          Tech Week
        </span>
      </a>
      <nav
        id="menu-movil"
        className={open ? "nav-links nav-links--open" : "nav-links"}
        aria-label="Navegación principal"
      >
        {navItems.map((item) => (
          <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
            {item.label}
          </a>
        ))}
        <a className="nav-links__live" href="#en-vivo" onClick={() => setOpen(false)}>
          <span /> En vivo
        </a>
      </nav>
      <button
        type="button"
        className="menu-button"
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        aria-controls="menu-movil"
      >
        <Icon name="menu" size={24} />
      </button>
    </header>
  );
}
