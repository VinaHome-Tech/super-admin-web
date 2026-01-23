<template>
    <div class="">
        <!-- HEADER + BUTTON -->
        <div class="flex items-center justify-between">
            <h1 class="text-xl font-bold">Quản lý Điểm Dừng</h1>

            <el-button type="primary" @click="openCreate">
                Thêm điểm dừng
            </el-button>
        </div>

        <el-table v-loading="loadingGlobalPoints" :data="filterTableData" border class="mt-4"
            style="margin-top: 10px ; width: 100%">

            <el-table-column type="index" label="#" width="50" />

            <el-table-column label="Tên điểm dừng" prop="name">
                <template #default="scope">
                    <div class="text-black">{{ scope.row.name }}</div>
                </template>
            </el-table-column>
            <el-table-column label="Mã điểm dừng" prop="code">
                <template #default="scope">
                    <div class="text-black">{{ scope.row.code }}</div>
                </template>
            </el-table-column>
            <el-table-column label="Loại điểm">
                <template #default="scope">
                    <el-tag type="info" effect="light">
                        {{ getPointTypeLabel(scope.row.point_type) }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="Trạng thái" width="140">
                <template #default="scope">
                    <el-tag :type="getPointStatusTagType(scope.row.status)" effect="light">
                        {{ getPointStatusLabel(scope.row.status) }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="Địa chỉ">
                <template #default="scope">
                    <div class="text-black">{{ scope.row.province.name }}</div>
                    <div class="text-black">{{ scope.row.ward.name }}</div>
                    <div class="text-black">{{ scope.row.address }}</div>
                </template>
            </el-table-column>

            <el-table-column width="150" align="right">
                <template #header>
                    <el-input v-model="search" size="small" placeholder="Tìm kiếm" />
                </template>
                <template #default="scope">
                    <el-button size="small" type="primary" @click="openEdit(scope.$index, scope.row)">
                        Sửa
                    </el-button>

                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">
                        Xóa
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog v-model="dialogVisible" width="600px" :title="isEdit ? 'Chỉnh sửa điểm dừng' : 'Thêm điểm dừng'">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="150px">

                <el-form-item label="Trạng thái" prop="status">
                    <el-select v-model="form.status" placeholder="Chọn trạng thái" clearable>
                        <el-option v-for="item in pointStatusOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="Loại điểm" prop="point_type">
                    <el-select v-model="form.point_type" placeholder="Chọn loại điểm" clearable filterable>
                        <el-option v-for="item in pointTypeOptions" :key="item.value" :label="item.label"
                            :value="item.value">
                            <div class="flex items-center gap-2">
                                <span class="text-gray-900">{{ item.label }}</span>
                                <span v-if="item.note" class="text-gray-400 text-xs">{{ item.note }}</span>
                            </div>
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="Tên điểm dừng" prop="name">
                    <el-input v-model="form.name" />
                </el-form-item>
                <el-form-item label="Mã điểm dừng" prop="code">
                    <el-input v-model="form.code" />
                </el-form-item>

                <el-form-item label="Tỉnh/Thành phố" prop="province_id">
                    <el-select v-model="tmpProvinceCode" placeholder="Chọn tỉnh/thành phố" clearable filterable
                        @change="handleProvinceChange">
                        <el-option v-if="loadingProvinces" :label="'Đang tải danh sách...'" :value="null" disabled />
                        <el-option v-else v-for="item in listProvince" :key="item.id" :label="item.name"
                            :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="Phường/Xã" prop="ward_id">
                    <el-select v-model="tmpWardCode" placeholder="Chọn phường/xã" clearable filterable
                        @change="handleWardChange">
                        <el-option v-if="loadingWards" :label="'Đang tải danh sách...'" :value="null" disabled />
                        <el-option v-for="item in listWard" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="Địa chỉ" prop="address">
                    <el-input v-model="form.address" />
                </el-form-item>
            </el-form>

            <template #footer>
                <el-button @click="handleClose">Hủy</el-button>
                <el-button type="primary" @click="submitForm">Lưu</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import type { Company } from '@/types/company/company.interface'
import { companyService } from '@/services/identity-service/company.service'
import type { DTO_RQ_Point, GlobalPoint } from '@/types/point/point.interface'
import { PointStatus, PointType } from '@/types/point/point.interface'
import type { Province } from '@/types/point/province.interface'
import { pointService } from '@/services/resource-service/point.service'
import type { Ward } from '@/types/point/ward.interface'

const dialogVisible = ref(false)
const isEdit = ref(false) // xác định chế độ
const editIndex = ref<number | null>(null)

// Danh sách nhà xe
const tableData = ref<Company[]>([]);

// Form
const formRef = ref<FormInstance>()
const form = ref<DTO_RQ_Point>({
    id: undefined,
    status: undefined,
    point_type: undefined,
    name: undefined,
    code: undefined,
    address: undefined,
    province_id: undefined,
    province_code: undefined,
    ward_id: undefined,
    ward_code: undefined,
})
const tmpProvinceCode = ref<string>('');
const tmpWardCode = ref<string>('');


// Validation rules
const rules = reactive<FormRules>({
    status: [
        { required: true, message: 'Vui lòng chọn trạng thái', trigger: 'change' }
    ],
    point_type: [
        { required: true, message: 'Vui lòng chọn loại điểm', trigger: 'change' }
    ],
    name: [
        { required: true, message: 'Vui lòng nhập tên điểm dừng', trigger: 'blur' }
    ],
    short_name: [
        { required: true, message: 'Vui lòng nhập tên rút gọn', trigger: 'blur' }
    ],
    code: [
        { required: true, message: 'Vui lòng nhập mã điểm dừng', trigger: 'blur' }
    ],
    province_id: [
        { required: true, message: 'Vui lòng chọn tỉnh/thành phố', trigger: 'blur' }
    ],
    ward_id: [
        { required: true, message: 'Vui lòng chọn phường/xã', trigger: 'blur' }
    ],
})

const pointTypeOptions = [
    { value: PointType.BUS_STATION, label: 'Bến xe', note: '(Bến xe khách chính thức)' },
    { value: PointType.OFFICE, label: 'Văn phòng', note: '(Trụ sở, chi nhánh công ty)' },
    { value: PointType.REST_STOP, label: 'Trạm dừng chân', note: '(Trạm nghỉ cho xe khách)' },
    { value: PointType.AGENCY, label: 'Đại lý', note: '(Điểm bán vé, điểm trung gian)' },
    { value: PointType.LANDMARK, label: 'Địa danh', note: '(Ngã tư, vòng xoay, cầu, chợ, KCN, mốc nổi bật)' },
    { value: PointType.AIRPORT, label: 'Sân bay', note: '(Sân bay nội địa, quốc tế)' },
    { value: PointType.PORT, label: 'Bến tàu', note: '(Bến tàu thủy, tàu cao tốc)' },
    { value: PointType.TRAIN_STATION, label: 'Nhà ga', note: '(Ga tàu hỏa, metro)' },
    { value: PointType.AREA, label: 'Khu vực', note: '(Phạm vi rộng, không cố định 1 điểm)' },
    { value: PointType.ON_THE_WAY, label: 'Dọc đường', note: '(Điểm đón/trả không cố định)' },
]

const pointStatusOptions = [
    { value: PointStatus.ACTIVE, label: 'Đang hoạt động' },
    { value: PointStatus.INACTIVE, label: 'Tạm ngưng' },
]

const getPointTypeLabel = (value?: PointType) =>
    pointTypeOptions.find((item) => item.value === value)?.label || '---'

const getPointStatusLabel = (value?: PointStatus) =>
    pointStatusOptions.find((item) => item.value === value)?.label || '---'

const getPointStatusTagType = (value?: PointStatus) => {
    if (value === PointStatus.ACTIVE) return 'success'
    if (value === PointStatus.INACTIVE) return 'warning'
    return 'info'
}

const loadingProvinces = ref(false);
const listProvince = ref<Province[]>([]);
const fetchProvinces = async () => {
    loadingProvinces.value = true;
    try {
        const res = await pointService.API_GetAllProvince();
        if (res.success && res.result) {
            listProvince.value = res.result;
        } else {
            ElMessage.error(res.message || 'Không thể tải danh sách tỉnh/thành phố');
        }
    } catch (error) {
        console.error(error)
        ElMessage.error('Không thể tải danh sách tỉnh/thành phố');
    } finally {
        loadingProvinces.value = false;
    }
}
const loadingWards = ref(false);
const listWard = ref<Ward[]>([]);
const fetchWards = async (province_id: string) => {
    loadingWards.value = true;
    try {
        const res = await pointService.API_GetWardsByProvinceCode(province_id);
        if (res.success && res.result) {
            listWard.value = res.result;
        } else {
            ElMessage.error(res.message || 'Không thể tải danh sách phường/xã');
        }
    } catch (error) {
        console.error(error)
        ElMessage.error('Không thể tải danh sách phường/xã');
    } finally {
        loadingWards.value = false;
    }
}
const loadingGlobalPoints = ref(false);
const listGlobalPoints = ref<GlobalPoint[]>([]);
const fetchGlobalPoints = async () => {
    loadingGlobalPoints.value = true;
    try {
        const res = await pointService.API_GetAllGlobalPoints();
        if (res.success && res.result) {
            listGlobalPoints.value = res.result;
        } else {
            ElMessage.error(res.message || 'Không thể tải danh sách điểm dừng');
        }
    } catch (error) {
        console.error(error)
        ElMessage.error('Không thể tải danh sách điểm dừng');
    } finally {
        loadingGlobalPoints.value = false;
    }
}
const search = ref('')
const filterTableData = computed(() =>
    listGlobalPoints.value.filter(
        (data) =>
            !search.value ||
            (data.name && data.name.toLowerCase().includes(search.value.toLowerCase())) ||
            (data.code && data.code.toLowerCase().includes(search.value.toLowerCase()))
    )
)
const handleClose = () => {
    formRef.value?.resetFields()
    dialogVisible.value = false
}

/* -------------------
      THÊM MỚI
--------------------*/
const openCreate = () => {
    isEdit.value = false
    editIndex.value = null
    form.value = {
        id: undefined,
        status: undefined,
        point_type: undefined,
        name: undefined,
        code: undefined,
        address: undefined,
        province_id: undefined,
        ward_id: undefined,
        province_code: undefined,
        ward_code: undefined,
    }
    tmpProvinceCode.value = '';
    tmpWardCode.value = '';
    

    dialogVisible.value = true
}

/* -------------------
      SỬA
--------------------*/
const openEdit = async (index: number, row: GlobalPoint) => {
    console.log(row);
    isEdit.value = true
    editIndex.value = index
    const province = listProvince.value.find(p => p.id === row.province.id)
    form.value = {
        id: row.id,
        status: row.status,
        point_type: row.point_type,
        name: row.name,
        code: row.code,
        address: row.address,
        province_id: row.province.id,
        province_code: province?.province_code,
        ward_id: row.ward.id,
        ward_code: undefined,
    }
    tmpProvinceCode.value = form.value.province_id || '';
    if (form.value.province_id) {
        await fetchWards(form.value.province_id);
    }
    const ward = listWard.value.find(w => w.id === row.ward.id);
    form.value.ward_code = ward?.ward_code;
    tmpWardCode.value = form.value.ward_id || '';
    dialogVisible.value = true
}

/* -------------------
      LƯU FORM
--------------------*/
const submitForm = () => {
    if (!formRef.value) return

    formRef.value.validate(async (valid) => {
        if (!valid) return

        if (isEdit.value && editIndex.value !== null) {
            console.log(form.value);
            const res = await pointService.API_UpdateGlobalPoint(form.value.id!, form.value);
            if (res.success) {
                ElMessage.success('Cập nhật điểm dừng thành công');
                listGlobalPoints.value[editIndex.value] = res.result || {
                    id: form.value.id!,
                    name: form.value.name!,
                    code: form.value.code!,
                    status: form.value.status!,
                    point_type: form.value.point_type!,
                    address: form.value.address!,
                    province: listProvince.value.find(p => p.id === form.value.province_id) || { id: form.value.province_id!, name: '' },
                    ward: listWard.value.find(w => w.id === form.value.ward_id) || { id: form.value.ward_id!, name: '' },
                } as GlobalPoint;
                dialogVisible.value = false;
            } else {
                ElMessage.error(res.message || 'Cập nhật điểm dừng thất bại');
            }
        } else {
            console.log(form.value);
            const res = await pointService.API_CreateGlobalPoint(form.value);

            if (res.success && res.result) {
                ElMessage.success('Tạo điểm dừng thành công');
                listGlobalPoints.value.unshift(res.result);
                dialogVisible.value = false;
            } else {
                ElMessage.error(res.message || 'Tạo điểm dừng thất bại');
            }

        }

        // dialogVisible.value = false
    })
}

/* -------------------
      XÓA
--------------------*/
const handleDelete = async (index: number, row: Company) => {
    try {
        const res = await companyService.API_Delete(row.id!);
        if (res.success) {
            ElMessage.success('Xóa công ty thành công');
            tableData.value.splice(index, 1);
        } else {
            ElMessage.error(res.message || 'Xóa công ty thất bại');
        }
    } catch (error) {
        console.error(error)
        ElMessage.error('Xóa công ty thất bại');
    }
}

const handleProvinceChange = (provinceId: string) => {
    const p = listProvince.value.find(x => x.id === provinceId);

    if (p) {
        form.value.province_code = p.province_code;  // dùng cho API
        form.value.province_id = p.id;               // dùng để submit

        // reset ward
        tmpWardCode.value = '';
        form.value.ward_id = undefined;
        form.value.ward_code = undefined;
        listWard.value = [];

        fetchWards(p.id);                 // gọi API
    }
};

const handleWardChange = (wardId: string) => {
    const w = listWard.value.find(x => x.id === wardId);

    if (w) {
        form.value.ward_code = w.ward_code;   // dùng khi cần
        form.value.ward_id = w.id;            // dùng để submit
    }
};





onMounted(() => {
    fetchGlobalPoints();
    fetchProvinces();
})
</script>
