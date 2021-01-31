// import { mount } from "@vue/test-utils";

import { keyBy } from "lodash";
import { Artifact } from "~/modules/core/Artifact";
import relic from "~/content/en/relic/relic.json";

describe("Artifact", () => {
  test("decode from string", () => {
    const relicMap = keyBy(relic, "id");
    const a = Artifact.fromCode("0KwsDKB0J43NA1gC2l", relicMap);
    expect(a.typeId).toBe(80530);
    expect(a.code).toBe("0KwsDKB0J43NA1gC2l");
  });
});
