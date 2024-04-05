export class EnumToDropdown {

    static transform(enumType): any {
        let keys = [];
        for (var enumMember in enumType) {
            if (!isNaN(parseInt(enumMember, 10))) {
                keys.push({ label: enumType[parseInt(enumMember)], value: Number(enumMember) });
            }
        }
        return keys;
    }
}