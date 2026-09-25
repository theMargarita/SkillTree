Here’s the improved README.md file, incorporating the new content while maintaining the existing structure and information:

# SkillTree

SkillTree is a .NET 9 application that demonstrates project structure, build and run instructions, and contributor guidelines for a sample/learning project.

## Requirements

- .NET 9 SDK
- Visual Studio 2022 (latest update) or VS Code with C# extensions

## Getting started

1. Clone the repository:

   git clone https://github.com/theMargarita/SkillTree.git
   cd SkillTree

2. Open the solution in Visual Studio 2022: use __File > Open > Project/Solution__ and select the `.sln` file.

3. Or use the CLI:

   dotnet restore
   dotnet build
   dotnet run --project <ProjectName>

Replace `<ProjectName>` with the desired startup project folder or csproj file.

## Project structure

- `src/` - application projects
- `tests/` - test projects
- `.editorconfig` - coding style rules
- `CONTRIBUTING.md` - contribution guidelines

## Build & test

Run unit tests with:

dotnet test

## Contributing

See `CONTRIBUTING.md` for contribution guidelines, coding standards, and commit message conventions.

## Coding style

This repository enforces rules in `.editorconfig`. Please follow those rules when contributing.

## License

Specify a license in `LICENSE` or update this section.
