<script setup lang="ts">
import { onMounted, ref } from "vue";
import { message } from "@/utils/message";
import {
  getSnippets,
  createSnippet,
  updateSnippet,
  deleteSnippet,
  type SnippetItem,
  type SnippetInput
} from "@/api/snippet";

defineOptions({ name: "SnippetIndex" });

const loading = ref(false);
const saving = ref(false);
const rows = ref<SnippetItem[]>([]);
const dialogVisible = ref(false);
const editingId = ref<number | null>(null);
const form = ref<SnippetInput>({
  content: "",
  category: "生活",
  status: "draft"
});

async function reload() {
  loading.value = true;
  try {
    rows.value = await getSnippets();
  } catch {
    message("加载碎片失败", { type: "error" });
  } finally {
    loading.value = false;
  }
}

function openDialog(item?: SnippetItem) {
  editingId.value = item?.id ?? null;
  form.value = item
    ? { content: item.content, category: item.category, status: item.status }
    : { content: "", category: "生活", status: "draft" };
  dialogVisible.value = true;
}

async function save() {
  const content = form.value.content.trim();
  if (!content || content.length > 500) {
    message("内容需要填写 1–500 字", { type: "warning" });
    return;
  }
  saving.value = true;
  try {
    const data = { ...form.value, content };
    if (editingId.value === null) await createSnippet(data);
    else await updateSnippet(editingId.value, data);
    dialogVisible.value = false;
    message("保存成功", { type: "success" });
    await reload();
  } catch {
    message("保存失败", { type: "error" });
  } finally {
    saving.value = false;
  }
}

async function toggle(item: SnippetItem) {
  try {
    await updateSnippet(item.id, {
      status: item.status === "published" ? "draft" : "published"
    });
    await reload();
  } catch {
    message("状态修改失败", { type: "error" });
  }
}

async function remove(item: SnippetItem) {
  try {
    await deleteSnippet(item.id);
    message("删除成功", { type: "success" });
    await reload();
  } catch {
    message("删除失败", { type: "error" });
  }
}

onMounted(reload);
</script>

<template>
  <div class="p-4">
    <el-card shadow="never">
      <template #header>
        <div class="flex-bc">
          <span class="font-medium">碎片管理</span>
          <el-button type="primary" @click="openDialog()">新增碎片</el-button>
        </div>
      </template>
      <el-table
        v-loading="loading"
        :data="rows"
        row-key="id"
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column label="内容" min-width="300">
          <template #default="{ row }">
            <span class="line-clamp-2">{{ row.content }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="分类" width="90" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'published' ? 'success' : 'info'">
              {{ row.status === "published" ? "已发布" : "草稿" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180">
          <template #default="{ row }">{{
            row.created_at?.replace("T", " ").slice(0, 19)
          }}</template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openDialog(row)"
              >编辑</el-button
            >
            <el-button link type="primary" @click="toggle(row)">
              {{ row.status === "published" ? "下架" : "发布" }}
            </el-button>
            <el-popconfirm title="确认删除这条碎片？" @confirm="remove(row)">
              <template #reference
                ><el-button link type="danger">删除</el-button></template
              >
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      v-model="dialogVisible"
      :title="editingId === null ? '新增碎片' : '编辑碎片'"
      width="600px"
    >
      <el-form label-width="70px">
        <el-form-item label="内容">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="6"
            maxlength="500"
            show-word-limit
            placeholder="写一条游戏、生活或随记短句"
          />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="form.category" style="width: 160px">
            <el-option label="游戏" value="游戏" />
            <el-option label="生活" value="生活" />
            <el-option label="随记" value="随记" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="form.status"
            active-value="published"
            inactive-value="draft"
            active-text="发布"
            inactive-text="草稿"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="save"
          >保存</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>
