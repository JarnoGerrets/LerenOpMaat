export function setupModuleOverviewTestDOM() {
    document.getElementById("test-root").innerHTML = `<div id="test-root"><module-overview></module-overview></div>`;
}

export function getMockModuleOverviewServices(modules = [], profiles = []) {
    return {
        getModules: jasmine.createSpy("getModules").and.callFake((query) => {
            if (query) {
                return Promise.resolve(modules.filter(m => m.name.includes(query)));
            }
            return Promise.resolve(modules);
        }),
        getProfiles: jasmine.createSpy("getProfiles").and.returnValue(Promise.resolve(profiles)),
    };
}

export function getMockModules() {
    return [{"Id":1,"Name":"Introduction to Programming","Code":"IP.01","Description":"Introduction to Programming","Ec":30,"Level":1,"Period":1,"IsActive":true,"GraduateProfile":{"Id":3,"Name":"IDNS","ColorCode":"#4594D3A0"},"Requirements":[],"Evls":[{"Id":1,"Name":"EVL 1","Ec":10},{"Id":2,"Name":"EVL 2","Ec":10},{"Id":3,"Name":"EVL 3","Ec":10}]},{"Id":2,"Name":"Web Development Basics","Code":"WDB.02","Description":"Web Development Basics","Ec":30,"Level":2,"Period":2,"IsActive":true,"GraduateProfile":{"Id":1,"Name":"BIM","ColorCode":"#F16682A0"},"Requirements":[{"$type":"module","RequiredModule":{"Id":9,"Name":"Introduction to Programming","Code":"IP.09","Description":"Introduction to Programming","Ec":30,"Level":3,"Period":2,"IsActive":true,"GraduateProfile":{"Id":2,"Name":"SE","ColorCode":"#F5A61AA0"},"Requirements":[],"Evls":[]},"Id":2,"ModuleId":2,"Type":"RequiredModule","Description":"Introduction to Programming moet afgerond zijn."}],"Evls":[{"Id":4,"Name":"EVL 1","Ec":10},{"Id":5,"Name":"EVL 2","Ec":10},{"Id":6,"Name":"EVL 3","Ec":10}]}];
}

export function getMockProfiles() {
    return [
        { Id: 1, Name: "Developer", ColorCode: "#ff0000" },
        { Id: 2, Name: "Designer", ColorCode: "#00ff00" },
        { Id: 3, Name: "Designer", ColorCode: "#00ff00" },
    ];
}

export function mockUserRole(role = "Teacher") {
    window.userData = Promise.resolve({ EffectiveRole: role });
}
