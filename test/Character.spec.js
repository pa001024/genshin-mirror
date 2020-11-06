import { mount } from "@vue/test-utils";
import Character from "@/components/Character.vue";

describe("Character", () => {
  test("is a Vue instance", () => {
    const wrapper = mount(Character);
    expect(wrapper.vm).toBeTruthy();
  });
});
