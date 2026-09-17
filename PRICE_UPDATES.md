# Updating Supreme Energy prices

Send the developer the new price for each affected product and the effective date/time.

The editable values are grouped in `src/data/products.ts`:
- Change only the `price` number for PMS, AGO, LPG, LPFO/LPO, or Naphtha.
- Update `PRICE_LAST_UPDATED` in the same file.
- Keep density and flash-point specifications unchanged unless Supreme Energy formally approves revised ranges.

No admin panel or database is required. After a developer publishes the change, the homepage, products page, quote calculator, and generated PDF use the new price automatically.
