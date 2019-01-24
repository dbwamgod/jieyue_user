<template>
    <div class="binding" ref="bin">
        <Tree :data="data4" v-if="data4.length" show-checkbox multiple ref="treeT"></Tree>
        <Button type="primary" @click="oks" class="sure">确定</Button>
        <Button ref="binW" @click="ocal">返回</Button>
    </div>
</template>
<script>
import api from "@/api";
import Cookies from "js-cookie";

export default {
  data() {
    return {
      resIdLists: [],
      resIdList: [],
      data5: [],
      data4: [],
      union: 0,
      disabled: true,
      deepFind: []
    };
  },
  created() {
    this.init();
    // console.log("======created", this.$refs.treeT);
  },
  mounted() {
    //   console.log('======moun',this.$refs.treeT)
//      this.$nextTick(() => {
//     console.log("======mounted", this.$refs.binW.offsetTop);
//   })

  },
  watch: {
    /*  'union' (to, form) {

                   if (to) {
                       this.data4[0].children.map(r => {

                           if (r.children[0].checked) {
                               r.children.map(t => {
                                   t.disableCheckbox = false;
                               });
                           } else {
                               r.children.map((t, i) => {
                                   if (i) {
                                       t.disableCheckbox = true;
                                       this.disabled = false;
                                   }
                               });
                           }
                       });
                   }

               } */
    //    'data4'(data) {
    //        console.log('asdasd',data);
    //        if(this.$refs.treeT){
    //        }
    //    }
  },
  methods: {
    ocal() {
      this.$router.back(-1);
    },
    sele(item) {
      return item.map(r => {
        if (r.hasOwnProperty("children")) {
          return {
            checked: r.checked || false,
            indeterminate: r.indeterminate || false,
            id: r.id,
            title: r.title,
            children: this.sele(r.children)
          };
        } else {
          return {
            checked: r.checked || false,
            indeterminate: r.indeterminate || false,
            id: r.id,
            title: r.title
          };
        }
      });
    },
    deepFindFn(res) {
      // if(res.children && res.children.length != 0){
      //     this.deepFindFn(res.children)
      //
      res.map(t => {
        t.checked ? this.deepFind.push(t) : "";
        t.children && this.deepFindFn(t.children);
      });
    },
    oks() {
      this.resIdLists = this.sele(this.data4);
      this.resIdLists.forEach((item, index) => {
        let result = item.children.filter((r, index) => {
          let resFind;

          if (r.children) {
            resFind = r.children.filter(res => {
              // res.children && res.children.filter(t =>  t.checked?this.deepFind.push(t):"");
              res.children && this.deepFindFn(res.children);
              return res.checked === true || res.indeterminate === true;
            });
          } else {
            if (r.checked == true || r.indeterminate) {
              this.resIdList.push(r.id);
            }
          }
          if (typeof resFind === "object") {
            resFind.forEach(item => {
              this.resIdList.push(item.id);
              this.resIdList.push(r.id);
            });
            this.deepFind.length &&
              this.deepFind.map(y => {
                this.resIdList.push(y.id);
                this.resIdList.push(r.id);
              });
          }
          return r.checked === true;
        });
      });
      let set = new Set(this.resIdList);

      this.resIdList = [];
      set._c.forEach(r => {
        this.resIdList.push(r);
      });
      this.$axios({
        method: "post",
        url: api.role_bound(),
        data: {
          resIdList: this.resIdList,
          roleId: JSON.parse(this.$route.query.id),
          userId: Cookies.get("user_userId")
        },
        headers: {
          Authorization: Cookies.get("token"),
          "Content-Type": "application/json;charset=UTF-8"
        }
      }).then(res => {
        this.resIdList = [];
        if (res.data.code == 200) {
          this.$Message.info("已绑定");
          this.$router.back(-1);
        } else {
          this.$Message.info(res.data.msg);
        }
      });
    },
    init() {
      this.$axios({
        method: "get",
        url: api.role_bounds(JSON.parse(this.$route.query.id)),
        headers: {
          Authorization: Cookies.get("token"),
          "Content-Type": "application/json;charset=UTF-8"
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.data4 = this.CascaderIsName(res.data.data);
          // this.data4[0].children.map(r => {
          //     if (r.children[0].checked) {
          //         r.children.map(t => {
          //             if (t.title.includes('列表', 0)) {
          //                 t.checked = true;
          //             }
          //         });
          //     } else {
          //         r.children.map((t, i) => {
          //             if (i) {
          //                 t.disableCheckbox = true;
          //             }
          //         });
          //     }
          // });
        }
      });
    },
    CascaderIsName(item) {
      return item.map((r, i) => {
        if (r.hasOwnProperty("voList")) {
          return {
            title: r.tenantName || r.resourceName,
            resourceId: r.resourceId || "",
            tenantId: r.tenantId || "",
            parentId: r.parentId || "",
            expand: true,
            children: this.CascaderIsName(r.voList)
          };
        } else if (r.hasOwnProperty("child") && r.child) {
          return {
            title: r.resourceName || r.tenantName,
            resourceId: r.resourceId || "",
            tenantId: r.tenantId || "",
            parentId: r.parentId || "",
            checked: r.bound,
            expand: true,
            id: r.resourceId,
            children: this.CascaderIsName(r.child)
          };
        } else {
          //租户下的所有菜单权限和功能(和getCheckedAndIndeterminateNodes选中节点比较  只拿出最新添加的哪一项)
          // this.union.push(r);

          return {
            title: r.tenantName || r.resourceName,
            resourceId: r.resourceId || "",
            tenantId: r.tenantId || "",
            parentId: r.parentId || "",
            checked: r.bound,
            // disableCheckbox: false,
            expand: true,
            id: r.resourceId
          };
        }
      });
    }
    // checkChange (e) {
    //     //被选中节点和选中节点
    //     // let checkNodes = this.$refs.treeT.getCheckedAndIndeterminateNodes();
    //     let clone = this.$refs.treeT.getCheckedNodes();
    //     if (e.length && clone[0].checked) {
    //         this.union += 1;
    //
    //     }
    // },
  }
};
</script>
<style scoped>
.binding {
  position: fixed;
  margin: 35px 0 50px 40px;
  width: 350px;
  top: 4%;
  left: 15%;
  height: 91%;
  overflow-y: scroll;
}

.sure {
  margin: 0 0 0 55%;
}
</style>
