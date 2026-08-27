import { cx as j, cy as $, cD as f, cE as p, cF as b, i, cM as v, cH as c, cN as L, cJ as A, aO as T, cI as q, aZ as D, cL as R, cK as G, cG as H, bF as J, x as K, A as m, cC as d } from "./index-BegIKaMc.js";
import { X as W } from "./x-yVqVO2B3.js";
import { P as X } from "./plus-Cl_SEO9R.js";
import { L as Z } from "./loader-circle-T39qj1Kc.js";
const Q = ["src"];
const Y = ["onClick"];
const ee = {
  class: "form-footer"
};
const te = {
  __name: "FeedbackModal",
  props: {
    productSlug: {
      type: String,
      default: "huoke-radar"
    }
  },
  emits: ["success"],
  setup(I, {
    emit: S
  }) {
    const V = I;
    const z = S;
    const {
      invoke: k
    } = $();
    const s = K({
      content: "",
      contact: "",
      images: []
    });
    const r = m([]);
    const w = m(false);
    const y = m(false);
    const g = m(false);
    const x = m(null);
    const N = () => {
      if (!w.value) {
        x.value.click();
      }
    };
    const h = t => {
      if (!t || !t.type.startsWith("image/")) {
        return;
      }
      if (r.value.length >= 3) {
        d.warning("最多只能上传 3 张图片");
        return;
      }
      if (t.size > 5242880) {
        d.error("图片大小不能超过 5MB");
        return;
      }
      const e = URL.createObjectURL(t);
      r.value.push({
        preview: e,
        file: t
      });
    };
    const P = t => {
      const e = t.target.files[0];
      if (e) {
        h(e);
      }
      t.target.value = "";
    };
    const F = t => {
      var l;
      const e = (l = t.clipboardData) == null ? undefined : l.items;
      if (e) {
        for (let a = 0; a < e.length; a++) {
          if (e[a].type.indexOf("image") !== -1) {
            const u = e[a].getAsFile();
            h(u);
          }
        }
      }
    };
    const B = t => {
      var l;
      g.value = false;
      const e = (l = t.dataTransfer) == null ? undefined : l.files;
      if (!!e && e.length !== 0) {
        for (let a = 0; a < e.length; a++) {
          if (r.value.length < 3) {
            h(e[a]);
          }
        }
      }
    };
    const E = t => {
      const e = r.value[t];
      if (e.preview) {
        URL.revokeObjectURL(e.preview);
      }
      r.value.splice(t, 1);
    };
    const M = async () => {
      if (!s.content.trim()) {
        d.warning("请输入反馈内容");
        return;
      }
      y.value = true;
      try {
        const t = [];
        for (const n of r.value) {
          const U = await new Promise(_ => {
            const C = new FileReader();
            C.onload = O => _(O.target.result);
            C.readAsDataURL(n.file);
          });
          const o = await k("upload-feedback-image", {
            base64: U,
            fileName: n.file.name || `paste_${Date.now()}.png`
          });
          if (o.success) {
            t.push(o.relativeUrl);
          } else {
            throw new Error("图片上传失败: " + o.msg);
          }
        }
        const e = localStorage.getItem("device_id") || "unknown";
        let l = "1.0.15";
        try {
          const n = await k("get-version-info");
          if (n && n.appVersion) {
            l = n.appVersion;
          }
        } catch {}
        const a = {
          product_slug: V.productSlug,
          device_id: e,
          content: s.content,
          contact: s.contact,
          images: t.join(","),
          app_version: l
        };
        const u = await k("submit-feedback", a);
        if (u.success) {
          d.success("提交成功，感谢您的反馈！");
          z("success");
          s.content = "";
          s.contact = "";
          r.value.forEach(n => URL.revokeObjectURL(n.preview));
          r.value = [];
        } else {
          d.error("提交失败: " + u.msg);
        }
      } catch (t) {
        d.error(t.message || "系统繁忙，请稍后再试");
      } finally {
        y.value = false;
      }
    };
    return (t, e) => {
      const l = f("a-textarea");
      const a = f("a-form-item");
      const u = f("a-input");
      const n = f("a-button");
      const U = f("a-form");
      p();
      return b("div", {
        class: "feedback-container",
        onPaste: F
      }, [i(U, {
        model: s,
        layout: "vertical"
      }, {
        default: v(() => [i(a, {
          label: "反馈内容",
          required: ""
        }, {
          default: v(() => [i(l, {
            value: s.content,
            "onUpdate:value": e[0] ||= o => s.content = o,
            placeholder: "请详细描述您遇到的问题或建议，支持直接粘贴截图...",
            rows: 4,
            maxlength: 500,
            "show-count": "",
            onPaste: F
          }, null, 8, ["value"])]),
          _: 1
        }), i(a, {
          label: "上传截图"
        }, {
          default: v(() => [c("div", {
            class: A(["upload-area", {
              dragging: g.value
            }]),
            onDragover: e[1] ||= L(o => g.value = true, ["prevent"]),
            onDragleave: e[2] ||= L(o => g.value = false, ["prevent"]),
            onDrop: L(B, ["prevent"])
          }, [(p(true), b(T, null, q(r.value, (o, _) => {
            p();
            return b("div", {
              key: _,
              class: "image-preview"
            }, [c("img", {
              src: o.preview
            }, null, 8, Q), c("div", {
              class: "remove-btn",
              onClick: C => E(_)
            }, [i(D(W), {
              size: 14
            })], 8, Y)]);
          }), 128)), r.value.length < 3 ? (p(), b("div", {
            key: 0,
            class: "upload-btn",
            onClick: N
          }, [w.value ? (p(), R(D(Z), {
            key: 1,
            class: "animate-spin",
            size: 24
          })) : (p(), R(D(X), {
            key: 0,
            size: 24
          })), c("span", null, G(w.value ? "上传中" : "添加图片"), 1)])) : H("", true)], 34), c("input", {
            type: "file",
            ref_key: "fileInput",
            ref: x,
            style: {
              display: "none"
            },
            accept: "image/*",
            onChange: P
          }, null, 544), e[4] ||= c("div", {
            class: "upload-tip"
          }, "支持粘贴截图、拖拽文件或点击上传 (最多 3 张)", -1)]),
          _: 1
        }), i(a, {
          label: "联系方式"
        }, {
          default: v(() => [i(u, {
            value: s.contact,
            "onUpdate:value": e[3] ||= o => s.contact = o,
            placeholder: "请留下您的微信号或手机号，方便我们与您联系"
          }, null, 8, ["value"])]),
          _: 1
        }), c("div", ee, [i(n, {
          type: "primary",
          block: "",
          size: "large",
          loading: y.value,
          onClick: M
        }, {
          default: v(() => [...(e[5] ||= [J(" 提交反馈 ", -1)])]),
          _: 1
        }, 8, ["loading"])])]),
        _: 1
      }, 8, ["model"])], 32);
    };
  }
};
const re = j(te, [["__scopeId", "data-v-fc203f49"]]);
export { re as default };