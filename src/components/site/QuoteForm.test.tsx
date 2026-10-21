import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QuoteForm } from "./QuoteForm";
import { buildQuoteDoc } from "@/lib/pdf/buildQuoteDoc";

vi.mock("@/lib/pdf/buildQuoteDoc", () => ({ buildQuoteDoc: vi.fn() }));

async function completeForm() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Name *"), "Ada");
  await user.type(screen.getByLabelText("Phone *"), "+2349024876164");
  await user.type(screen.getByLabelText("Email *"), "ada@example.com");
  await user.type(screen.getByLabelText("City / delivery point *"), "Surulere");
  return user;
}

describe("quote builder", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(buildQuoteDoc).mockResolvedValue({ pdfName: "quote.pdf" });
  });
  it("rejects an empty form without generating a PDF", async () => {
    render(<QuoteForm />);
    await userEvent.click(screen.getByRole("button", { name: "Download PDF" }));
    expect(screen.getByRole("alert")).toHaveTextContent("Please enter your name");
    expect(buildQuoteDoc).not.toHaveBeenCalled();
  });
  it("rejects a malformed email and zero quantity", async () => {
    render(<QuoteForm />);
    const user = await completeForm();
    fireEvent.change(screen.getByLabelText("Email *"), { target: { value: "a@" } });
    await user.click(screen.getByRole("button", { name: "Download PDF" }));
    expect(screen.getByRole("alert")).toHaveTextContent("valid email");
    fireEvent.change(screen.getByLabelText("Email *"), { target: { value: "ada@example.com" } });
    fireEvent.change(screen.getByLabelText("Quantity"), { target: { value: "0" } });
    await user.click(screen.getByRole("button", { name: "Download PDF" }));
    expect(screen.getByRole("alert")).toHaveTextContent("greater than zero");
    expect(buildQuoteDoc).not.toHaveBeenCalled();
  });
  it("downloads a valid quote without promising email delivery", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    render(<QuoteForm initialProduct="lpg" />);
    const user = await completeForm();
    await user.click(screen.getByRole("button", { name: "Download PDF" }));
    expect(buildQuoteDoc).toHaveBeenCalledWith(
      [{ productId: "lpg", quantity: 1000 }],
      expect.objectContaining({ name: "Ada" }),
      670000,
    );
    expect(await screen.findByRole("status")).toHaveTextContent("does not send your details");
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
  it("shows a recoverable error if PDF generation fails", async () => {
    vi.mocked(buildQuoteDoc).mockRejectedValueOnce(new Error("PDF failed"));
    render(<QuoteForm />);
    const user = await completeForm();
    await user.click(screen.getByRole("button", { name: "Download PDF" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Please try again");
    expect(screen.getByRole("button", { name: "Download PDF" })).toBeEnabled();
    await user.click(screen.getByRole("button", { name: "Download PDF" }));
    expect(await screen.findByRole("status")).toHaveTextContent("downloaded");
  });
  it("updates totals as products are added, edited and removed", async () => {
    render(<QuoteForm initialProduct="unknown" />);
    expect(screen.getByRole("combobox")).toHaveValue("ago");
    expect(screen.getByRole("button", { name: "Remove product" })).toBeDisabled();
    fireEvent.change(screen.getByLabelText("Quantity"), { target: { value: "2" } });
    expect(screen.getByText(/1,840/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Add product" }));
    fireEvent.change(screen.getAllByRole("combobox")[1], { target: { value: "pms" } });
    expect(screen.getByText(/651,840/)).toBeInTheDocument();
    await userEvent.click(screen.getAllByRole("button", { name: "Remove product" })[1]);
    expect(screen.getByText(/1,840/)).toBeInTheDocument();
  });
  it("disables downloads while a PDF is being generated", async () => {
    let finish!: (value: { pdfName: string }) => void;
    vi.mocked(buildQuoteDoc).mockReturnValue(
      new Promise((resolve) => {
        finish = resolve;
      }),
    );
    render(<QuoteForm />);
    const user = await completeForm();
    await user.click(screen.getByRole("button", { name: "Download PDF" }));
    expect(screen.getByRole("button", { name: "Generating…" })).toBeDisabled();
    finish({ pdfName: "quote.pdf" });
    await waitFor(() => expect(screen.getByRole("button", { name: "Download PDF" })).toBeEnabled());
  });
});
