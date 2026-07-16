import {
  Laptop,
  Monitor,
  Cpu,
  HardDrive,
  Keyboard,
  Mouse,
  Headphones,
  Speaker,
  Gamepad2,
  Armchair,
  MemoryStick,
  Fan,
  Server,
  Cable,
  BatteryCharging,
  Package,
  Tags,
  Smartphone
} from 'lucide-react'

export const CATEGORY_ICON_OPTIONS = [
  { value: 'Laptop', label: 'Laptop', icon: Laptop },
  { value: 'Smartphone', label: 'Điện thoại', icon: Smartphone },
  { value: 'Monitor', label: 'Màn hình', icon: Monitor },
  { value: 'Cpu', label: 'CPU / Chip', icon: Cpu },
  { value: 'HardDrive', label: 'Ổ cứng', icon: HardDrive },
  { value: 'Keyboard', label: 'Bàn phím', icon: Keyboard },
  { value: 'Mouse', label: 'Chuột', icon: Mouse },
  { value: 'Headphones', label: 'Tai nghe', icon: Headphones },
  { value: 'Speaker', label: 'Loa', icon: Speaker },
  { value: 'Gamepad2', label: 'Máy chơi game', icon: Gamepad2 },
  { value: 'Armchair', label: 'Ghế', icon: Armchair },
  { value: 'MemoryStick', label: 'RAM', icon: MemoryStick },
  { value: 'Fan', label: 'Tản nhiệt', icon: Fan },
  { value: 'Server', label: 'PC / Máy chủ', icon: Server },
  { value: 'Cable', label: 'Phụ kiện / Cáp', icon: Cable },
  { value: 'BatteryCharging', label: 'Pin / Sạc', icon: BatteryCharging },
  { value: 'Package', label: 'Linh kiện khác', icon: Package },
  { value: 'Tags', label: 'Khác', icon: Tags },
]

export const getCategoryIcon = (iconName) => {
  const option = CATEGORY_ICON_OPTIONS.find(opt => opt.value === iconName)
  return option ? option.icon : Tags
}
