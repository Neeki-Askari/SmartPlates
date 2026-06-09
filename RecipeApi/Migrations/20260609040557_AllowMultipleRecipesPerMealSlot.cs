using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RecipeApi.Migrations
{
    /// <inheritdoc />
    public partial class AllowMultipleRecipesPerMealSlot : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_MealPlanRecipes_MealPlanId_DayOfWeek_MealType",
                table: "MealPlanRecipes");

            migrationBuilder.CreateIndex(
                name: "IX_MealPlanRecipes_MealPlanId_DayOfWeek_MealType",
                table: "MealPlanRecipes",
                columns: new[] { "MealPlanId", "DayOfWeek", "MealType" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_MealPlanRecipes_MealPlanId_DayOfWeek_MealType",
                table: "MealPlanRecipes");

            migrationBuilder.CreateIndex(
                name: "IX_MealPlanRecipes_MealPlanId_DayOfWeek_MealType",
                table: "MealPlanRecipes",
                columns: new[] { "MealPlanId", "DayOfWeek", "MealType" },
                unique: true);
        }
    }
}
