import { mount } from "@vue/test-utils";
import Avatar from "@/components/Avatar.vue";

describe("Avatar", () => {
  test("is a Vue instance", () => {
    const wrapper = mount(Avatar);
    expect(wrapper.vm).toBeTruthy();
  });
});
