<template>
    <div>
        <div class="flex items-center justify-between">
            <h1 class="text-xl font-bold">Tuyến nhà xe: {{ companyName }}</h1>

            <el-button type="primary" @click="handleAdd">
                Thêm tuyến
            </el-button>
        </div>

        <el-table v-loading="loadingData" :data="tableData" border class="mt-4" style="margin-top: 10px ; width: 100%">

            <el-table-column type="index" label="#" width="50" />

            <el-table-column label="Thông tin tuyến">
                <template #default="scope">
                    <div class="text-black">{{ scope.row.route_name }}</div>
                    <div>{{ scope.row.short_name }}</div>
                    <div>Giá: {{ formatVND(scope.row.base_price) }}</div>
                </template>
            </el-table-column>
            <el-table-column label="E-Ticket">
                <template #default="scope">
                    <div class="text-black">{{ scope.row.route_name_e_ticket }}</div>
                    <div>Giá: {{ formatVND(scope.row.e_ticket_price) }}</div>
                </template>
            </el-table-column>
            <el-table-column label="Trạng thái">
                <template #default="scope">
                    <el-tag :type="scope.row.status ? 'success' : 'danger'" effect="light">
                        {{ scope.row.status ? 'Đang hoạt động' : 'Ngưng hoạt động' }}
                    </el-tag>
                    <div>Tạo: {{ formatDate(scope.row.created_at) }}</div>
                    <div>Cập nhật: {{ formatDate(scope.row.updated_at) }}</div>
                </template>
            </el-table-column>

            <el-table-column width="150" align="center">
                <template #default="scope">
                    <el-dropdown trigger="click">
                        <el-button :icon="More" circle />
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="handleEdit(scope.$index, scope.row)">
                                    Chỉnh sửa
                                </el-dropdown-item>
                                <el-dropdown-item @click="handleDelete(scope.$index, scope.row)">
                                    Xóa
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog v-model="dialogVisible" width="600px" :title="isEdit ? 'Chỉnh sửa tuyến' : 'Thêm tuyến'">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="50px">
                <el-row>
                    <el-col :span="12" class="pr-1">
                        <el-form-item label="Tên tuyến" prop="route_name" label-position="top">
                            <el-input v-model="form.route_name" />
                        </el-form-item>
                        <el-form-item label="Tên tuyến rút gọn" prop="short_name" label-position="top">
                            <el-input v-model="form.short_name" />
                        </el-form-item>
                        <el-form-item label="Giá tuyến cơ bản" prop="base_price" label-position="top">
                            <el-input v-model.number="form.base_price" />
                        </el-form-item>
                        <el-form-item label="Tên tuyến trên vé điện tử" prop="route_name_e_ticket" label-position="top">
                            <el-input v-model="form.route_name_e_ticket" />
                        </el-form-item>
                        <el-form-item label="Giá vé điện tử" prop="e_ticket_price" label-position="top">
                            <el-input v-model.number="form.e_ticket_price" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" class="pl-1">
                        <el-form-item label="Quản đường(km)" prop="distance" label-position="top">
                            <el-input v-model.number="form.distance" />
                        </el-form-item>
                        <el-form-item label="Lộ trình" prop="journey" label-position="top">
                            <el-input v-model="form.journey" />
                        </el-form-item>

                        <el-form-item label="Ghi chú" prop="note" label-position="top">
                            <el-input v-model="form.note" />
                        </el-form-item>
                        <el-form-item label="Trạng thái" prop="status" label-position="top">
                            <el-switch v-model="form.status" />
                        </el-form-item>

                    </el-col>
                </el-row>
            </el-form>

            <template #footer>
                <el-button @click="handleClose">Hủy</el-button>
                <el-button type="primary" @click="submitForm">Lưu</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import { routeService } from '@/services/resource-service/route.service';
import type { DTO_RP_Route, DTO_RQ_Route } from '@/types/route/route.interface';
import { formatDate } from '@/utils/date';
import { ElMessage, type FormInstance } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { More } from '@element-plus/icons-vue';
import { formatVND } from '@/utils/price';

const route = useRoute();
const companyId = route.query.companyId;
const companyName = route.query.name;
const dialogVisible = ref(false)
const isEdit = ref(false)
const editIndex = ref<number | null>(null)
const formRef = ref<FormInstance>()
const tableData = ref<DTO_RP_Route[]>([]);
const form = ref<DTO_RQ_Route>({
    id: undefined,
    route_name: undefined,
    short_name: undefined,
    base_price: undefined,
    route_name_e_ticket: undefined,
    e_ticket_price: undefined,
    distance: undefined,
    journey: undefined,
    note: undefined,
    status: false,
});
const rules = {
    route_name: [{ required: true, message: 'Vui lòng nhập tên tuyến', trigger: 'blur' }],
    short_name: [{ required: true, message: 'Vui lòng nhập tên tuyến rút gọn', trigger: 'blur' }],
    base_price: [{ required: true, message: 'Vui lòng nhập giá tuyến cơ bản', trigger: 'blur' }],
    route_name_e_ticket: [{ required: true, message: 'Vui lòng nhập tên tuyến trên vé điện tử', trigger: 'blur' }],
    e_ticket_price: [{ required: true, message: 'Vui lòng nhập giá vé điện tử', trigger: 'blur' }],
}
const handleAdd = () => {
    isEdit.value = false
    editIndex.value = null
    form.value = {
        id: undefined,
        route_name: undefined,
        short_name: undefined,
        base_price: undefined,
        route_name_e_ticket: undefined,
        e_ticket_price: undefined,
        distance: undefined,
        journey: undefined,
        note: undefined,
        status: false,
    }
    dialogVisible.value = true
}
const handleEdit = (index: number, row: DTO_RP_Route) => {
    isEdit.value = true
    editIndex.value = index
    form.value = { ...row }
    dialogVisible.value = true
}
const handleDelete = async (index: number, row: DTO_RP_Route) => {
    try {
        const res = await routeService.API_DeleteRoute(row.id!);
        if (res.success) {
            ElMessage.success('Xóa tuyến thành công');
            tableData.value.splice(index, 1);
        } else {
            ElMessage.error(res.message || 'Xóa tuyến thất bại');
        }
    } catch (error: any) {
        const message = error?.response?.data?.message
            || error?.message
            || "Xóa tuyến thất bại";

        ElMessage.error(message);
    }
}
const handleClose = () => {
    formRef.value?.resetFields()
    dialogVisible.value = false
}
const submitForm = () => {
    if (!formRef.value) return

    formRef.value.validate(async (valid) => {
        if (!valid) return

        if (isEdit.value && editIndex.value !== null) {
            console.log(form.value);
            try {
                const res = await routeService.API_UpdateRoute(form.value.id as string, form.value);
                if (res.success) {
                    ElMessage.success('Cập nhật tuyến thành công');
                    tableData.value[editIndex.value] = res.result!;
                    dialogVisible.value = false;
                } else {
                    ElMessage.error(res.message || 'Cập nhật tuyến thất bại');
                }
            } catch (error: any) {
                const message = error?.response?.data?.message
                    || error?.message
                    || "Đã có lỗi xảy ra khi cập nhật tuyến";

                ElMessage.error(message);
            }
        } else {
            console.log(form.value);
            try {
                const res = await routeService.API_CreateRoute(companyId as string, form.value);
                if (res.success) {
                    ElMessage.success('Thêm tuyến thành công');
                    tableData.value.push(res.result!);
                    dialogVisible.value = false;
                } else {
                    ElMessage.error(res.message || 'Thêm tuyến thất bại');
                }
            } catch (error: any) {
                const message = error?.response?.data?.message
                    || error?.message
                    || "Đã có lỗi xảy ra khi thêm tuyến";

                ElMessage.error(message);
            }
        }
    })
}
const loadingData = ref(false);
const fetchRoutes = async (company_id: string) => {
    try {
        loadingData.value = true;
        const res = await routeService.API_GetRoutesByCompanyId(company_id);
        if (res.success) {
            tableData.value = res.result || [];
        } else {
            ElMessage.error(res.message || 'Lấy danh sách tuyến thất bại');
        }
    } catch (error: any) {
        const message = error?.response?.data?.message
            || error?.message
            || "Đã có lỗi xảy ra khi lấy danh sách tuyến";

        ElMessage.error(message);
    }
    finally {
        loadingData.value = false;
    }
}
onMounted(() => {
    fetchRoutes(companyId as string);
});
</script>