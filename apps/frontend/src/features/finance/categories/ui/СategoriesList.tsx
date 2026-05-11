import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RiAddLine, RiEditLine, RiPieChartLine } from "@remixicon/react"
// import { RiPieChartLine } from "@remixicon/react"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { useGetCategories } from "../model/useGetCategories"
import { CreateOrEditCategoryDialog } from "./CreateOrEditCategoryDialog"
import { CategoryIcon } from "@/shared/lib/categoryHalpers"

export function CategoriesList() {
  const { data: categories, isPending } = useGetCategories()

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {categories?.map((category) => (
          <Card className="relative w-full">
            <CardHeader>
              <CardTitle className="z-2 flex gap-2">{category.name}</CardTitle>
              <CardDescription className="absolute top-0">
                <CategoryIcon
                  icon={category.icon || ""}
                  className="opacity-10"
                />
              </CardDescription>
              <CardAction>
                <CreateOrEditCategoryDialog category={category}>
                  <Button variant={"outline"}>
                    <RiEditLine />
                  </Button>
                </CreateOrEditCategoryDialog>
              </CardAction>
            </CardHeader>
          </Card>
        ))}
        {categories?.length !== 0 && (
          <CreateOrEditCategoryDialog>
            <Button variant="outline" className="h-full min-h-12 w-full">
              <RiAddLine size={50} />
            </Button>
          </CreateOrEditCategoryDialog>
        )}
      </div>
      {!isPending && categories?.length === 0 && <WalletsEmptyList />}
    </>
  )
}

function WalletsEmptyList() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <RiPieChartLine />
        </EmptyMedia>
        <EmptyTitle>Категорий нет</EmptyTitle>
        <EmptyDescription>
          Вы еще не создали ни одной категории. Начните с создания своей первой
          категории.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <CreateOrEditCategoryDialog>
          <Button>Создать категорию</Button>
        </CreateOrEditCategoryDialog>
      </EmptyContent>
    </Empty>
  )
}
