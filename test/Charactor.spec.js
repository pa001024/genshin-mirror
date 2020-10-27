import { mount } from "@vue/test-utils";
import Charactor from "@/components/Charactor.vue";

describe("Charactor", () => {
  test("is a Vue instance", () => {
    const wrapper = mount(Charactor);
    expect(wrapper.vm).toBeTruthy();
  });
});
