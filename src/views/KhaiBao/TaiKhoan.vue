<template>
    <div>
        <div class="flex items-center justify-between">
            <h1 class="text-xl font-bold">Tài khoản Admin nhà xe: {{ companyName }}</h1>

            <el-button type="primary" @click="openCreate">
                Thêm tài khoản
            </el-button>
        </div>

        <el-table v-loading="loadingData" :data="tableData" border class="mt-4"
            style="margin-top: 10px ; width: 100%">

            <el-table-column type="index" label="#" width="50" />

            <el-table-column label="Thông tin cá nhân">
                <template #default="scope">
                    <div>Tên: {{ scope.row.name }}</div>
                    <div>Ngày sinh: {{ scope.row.date_of_birth }}</div>
                    <div>Giới tính:
                        {{ scope.row.gender === 1 ? 'Nam' : scope.row.gender === 2 ? 'Nữ' : 'Khác' }}
                    </div>


                </template>
            </el-table-column>
            <el-table-column label="Thông tin tài khoản">
                <template #default="scope">
                    <div>Tài khoản: {{ scope.row.username }}</div>

                    <div>
                        <el-tag :type="scope.row.status ? 'success' : 'danger'" effect="light">
                            {{ scope.row.status ? 'Đang hoạt động' : 'Ngưng hoạt động' }}
                        </el-tag>
                    </div>

                </template>
            </el-table-column>
            <el-table-column label="Thông tin liên hệ">
                <template #default="scope">
                    <div>Email: {{ scope.row.email }}</div>
                    <div>Điện thoại: {{ scope.row.phone }}</div>
                    <div>Địa chỉ: {{ scope.row.address }}</div>
                </template>
            </el-table-column>
            <el-table-column label="Trạng thái">
                <template #default="scope">
                    
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

        <el-dialog v-model="dialogVisible" width="600px" :title="isEdit ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản'">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="50px">
                <el-row>
                    <el-col :span="12" class="pr-1">
                        <el-form-item label="Tài khoản" prop="username" label-position="top">
                            <el-input v-model="form.username" />
                        </el-form-item>
                        <el-form-item v-if="!isEdit" label="Mật khẩu" prop="password" label-position="top">
                            <el-input type="password" v-model="form.password" />
                        </el-form-item>
                        <el-form-item label="Số điện thoại" prop="phone" label-position="top">
                            <el-input type="text" v-model="form.phone" />
                        </el-form-item>
                        <el-form-item label="Địa chỉ" prop="address" label-position="top">
                            <el-input v-model="form.address" />
                        </el-form-item>
                        <el-form-item label="Email" prop="email" label-position="top">
                            <el-input type="email" v-model="form.email" />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" class="pl-1">
                        <el-form-item label="Họ và tên" prop="name" label-position="top">
                            <el-input v-model="form.name" />
                        </el-form-item>
                        <el-form-item label="Ngày sinh" prop="date_of_birth" label-position="top">
                            <el-date-picker v-model="form.date_of_birth" type="date" placeholder="Chọn ngày sinh"
                                format="DD/MM/YYYY" value-format="YYYY-MM-DD" />
                        </el-form-item>

                        <el-form-item label="Giới tính" prop="gender" label-position="top">
                            <el-select v-model="form.gender" placeholder="Chọn giới tính">
                                <el-option label="Nam" :value="1" />
                                <el-option label="Nữ" :value="2" />
                                <el-option label="Khác" :value="3" />
                            </el-select>
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
import { accountService } from '@/services/identity-service/account.service';
import type { DTO_RP_Account, DTO_RQ_Account } from '@/types/account/account.interface';
import { ElMessage, type FormInstance } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { More } from '@element-plus/icons-vue';
import { formatDate } from '@/utils/date';

const route = useRoute();
const companyId = route.query.companyId;
const companyName = route.query.name;
const dialogVisible = ref(false)
const isEdit = ref(false)
const editIndex = ref<number | null>(null)
const tableData = ref<DTO_RP_Account[]>([]);
const formRef = ref<FormInstance>()
const form = ref<DTO_RQ_Account>({
    id: undefined,
    username: undefined,
    password: undefined,
    status: false,
    email: undefined,
    name: undefined,
    phone: undefined,
    address: undefined,
    date_of_birth: undefined,
    gender: undefined,
});
const openCreate = () => {
    isEdit.value = false
    editIndex.value = null
    form.value = {
        id: undefined,
        username: undefined,
        password: undefined,
        status: false,
        email: undefined,
        name: undefined,
        phone: undefined,
        address: undefined,
        date_of_birth: undefined,
        gender: undefined,
    }
    dialogVisible.value = true
}
const rules = {
    username: [
        { required: true, message: 'Vui lòng nhập tài khoản', trigger: 'blur' },
    ],
    password: [
        { required: true, message: 'Vui lòng nhập mật khẩu', trigger: 'blur' },
    ],
    name: [
        { required: true, message: 'Vui lòng nhập họ và tên', trigger: 'blur' },
    ],
    email: [
        { required: true, message: 'Vui lòng nhập email', trigger: 'blur' },
        { type: 'email', message: 'Email không hợp lệ', trigger: 'blur' },
    ],
    phone: [
        { required: true, message: 'Vui lòng nhập số điện thoại', trigger: 'blur' },
    ],
    address: [
        { required: true, message: 'Vui lòng nhập địa chỉ', trigger: 'blur' },
    ],

};
const handleEdit = (index: number, row: DTO_RP_Account) => {
    isEdit.value = true
    editIndex.value = index
    form.value = { ...row }
    dialogVisible.value = true
}
const handleClose = () => {
    formRef.value?.resetFields()
    dialogVisible.value = false
}
const handleDelete = async (index: number, row: DTO_RP_Account) => {
    try {
        const res = await accountService.API_DeleteAdminAccount(row.id!);
        if (res.success) {
            ElMessage.success('Xóa tài khoản thành công');
            tableData.value.splice(index, 1);
        } else {
            ElMessage.error(res.message || 'Xóa tài khoản thất bại');
        }
    } catch (error) {
        ElMessage.error('Xóa tài khoản thất bại');
    }
}
const submitForm = () => {
    if (!formRef.value) return

    formRef.value.validate(async (valid) => {
        if (!valid) return

        if (isEdit.value && editIndex.value !== null) {
            console.log(form.value);
            const res = await accountService.API_UpdateAdminAccount(form.value.id!, form.value);
            if (res.success) {
                ElMessage.success('Cập nhật tài khoản thành công');
                tableData.value[editIndex.value] = res.result!;
                dialogVisible.value = false;
            } else {
                ElMessage.error(res.message || 'Cập nhật tài khoản thất bại');
            }
        } else {
            console.log(form.value);
            const res = await accountService.API_CreateAdminAccount(companyId as string, form.value);
            if (res.success) {
                ElMessage.success('Tạo tài khoản thành công');
                tableData.value.push(res.result!);
                dialogVisible.value = false;
            } else {
                ElMessage.error(res.message || 'Tạo tài khoản thất bại');
            }
        }
    })
}
const loadingData = ref(false);
const fetchAdminAccounts = async (company_id: string) => {
    try {
        loadingData.value = true;
        const res = await accountService.API_GetAdminAccountsByCompany(company_id);
        if (res.success) {
            tableData.value = res.result || [];
        } else {
            ElMessage.error(res.message || 'Lấy danh sách tài khoản thất bại');
        }
    } catch (error) {
        ElMessage.error('Đã xảy ra lỗi khi lấy danh sách tài khoản');
    } finally {
        loadingData.value = false;
    }
};
onMounted(() => {
    fetchAdminAccounts(companyId as string);
});
</script>