//---------------------------------------------------//
// created: 05/03/2026                               //
// updated: 05/03/2026                               //
// by     : suryamin                                 //
// note   : tafe project assignment                  //
// program: helperService.test.ts                    //
// use    : unit test for helperService.ts           //
// npm    : --save-dev @types/jest                   //
//          --save-dev babel-preset-expo             //
//          --save-dev babel-jest                    //
// run    : npx jest --clearCache                    //
//          npm test                                 //
//---------------------------------------------------//

import { HelperService } from "../helperService";

describe("HelperService", () => {
  //-----------------------------//
  //---Test: getCategoryIcon()---//
  //-----------------------------//
  describe("getCategoryIcon", () => {
    it("should return the correct icon for a sub-category (Crash)", () => {
      const result = HelperService.getCategoryIcon("Incident", "Crash");
      expect(result.label).toBe("Crash");
      expect(result.icon).toBe("directions-car");
    });

    it("should return the main category icon if sub-category is unknown or empty", () => {
      const result = HelperService.getCategoryIcon("Fire", "");
      expect(result.label).toBe("Fire");
      expect(result.icon).toBe("local-fire-department");
    });

    it("should handle main category case-insensitivity and spacing (e.g., 'Major Event')", () => {
      const result = HelperService.getCategoryIcon("  MAJOR event  ");
      expect(result.label).toBe("Major Event");
      expect(result.icon).toBe("event");
    });

    it("should return a fallback icon for completely unknown categories", () => {
      const result = HelperService.getCategoryIcon("Unknown Category");
      expect(result.label).toBe("Unknown Category");
      expect(result.icon).toBe("warning");
      expect(result.color).toBe("#D32F2F");
    });
  });

  //----------------------------//
  //---Test: formatLocation()---//
  //----------------------------//
  describe("formatLocation", () => {
    it("should format a full location with crossStreet and suburb", () => {
      const props = {
        locationQualifier: "Near",
        roads: [
          {
            mainStreet: "George St",
            crossStreet: "Park St",
            suburb: "Sydney",
            direction: "Northbound",
          },
        ],
      };
      // Expected: "Near George St between Park St, Sydney (Northbound)"
      const result = HelperService.formatLocation(props);
      expect(result).toBe(
        "Near George St between Park St, Sydney (Northbound)",
      );
    });

    it("should include secondLocation using 'and' logic", () => {
      const props = {
        roads: [
          {
            mainStreet: "M1 Motorway",
            crossStreet: "Exit 1",
            secondLocation: "Exit 5",
            suburb: "Mooney Mooney",
          },
        ],
      };
      const result = HelperService.formatLocation(props);
      expect(result).toContain("between Exit 1 and Exit 5");
    });

    it("should return displayName if road info is missing", () => {
      const props = { displayName: "Sydney Harbour Bridge" };
      const result = HelperService.formatLocation(props);
      expect(result).toBe("Sydney Harbour Bridge");
    });

    it("should capitalize the first letter and remove double spaces", () => {
      const props = {
        locationQualifier: "   at",
        roads: [
          {
            mainStreet: "main road",
            suburb: "suburb",
          },
        ],
      };
      const result = HelperService.formatLocation(props);
      // Expected: "At main road, suburb"
      expect(result).toMatch(/^At/); // Checks capitalization
      expect(result).not.toContain("  "); // Checks double spaces
    });
  });
});
