import {
  UG_SEAT_ROWS,
  ITI_SEAT_ROWS,
  VIDYAPEETH_SEAT_ROWS,
  ITI_TOTAL_SEATS,
  ACADEMIC_SESSION,
  type SeatRow,
} from "@/lib/content/academic-ops";
import { getSeatMatrixOverrides } from "@/lib/actions/site-settings";

function mergeUgRows(base: SeatRow[], overrides: Record<string, Partial<SeatRow>> | undefined): SeatRow[] {
  if (!overrides) return base;
  return base.map((row) => {
    const key = row.slug ?? row.programme;
    const patch = overrides[key];
    return patch ? { ...row, ...patch } : row;
  });
}

export async function getPublicSeatMatrix() {
  const overrides = await getSeatMatrixOverrides();
  return {
    session: overrides.session ?? ACADEMIC_SESSION,
    notes:   overrides.notes ?? null,
    ug:      mergeUgRows(UG_SEAT_ROWS, overrides.ug),
    iti:     ITI_SEAT_ROWS,
    vidyapeeth: VIDYAPEETH_SEAT_ROWS,
    itiTotal:   ITI_TOTAL_SEATS,
  };
}
