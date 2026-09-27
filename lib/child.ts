/** 孩子档案：全 App 唯一来源。改名、换班级、调生日只改这里。 */

export const CHILD = {
  /** 姓名（幼儿园口令、演练脚本用） */
  name: '赖潇语',
  /** 班级 */
  className: '小一班',
  /** 昵称（教练话术里的称呼） */
  nickname: '小芽',
  /** 出生日期 2022-10-18 */
  birth: new Date(2022, 9, 18),
  /** 4 岁生日 2026-10-18 */
  fourthBirthday: new Date(2026, 9, 18),
} as const

export const CHILD_NAME = CHILD.name
export const CLASS_NAME = CHILD.className
export const CHILD_NICKNAME = CHILD.nickname

/** 故事提示词里的年龄称呼（按周岁取整） */
export function storyAgeLabel(now = new Date()) {
  const b = CHILD.birth
  const months =
    (now.getFullYear() - b.getFullYear()) * 12 + (now.getMonth() - b.getMonth()) - (now.getDate() < b.getDate() ? 1 : 0)
  return `${Math.max(0, Math.floor(months / 12))} 岁`
}
