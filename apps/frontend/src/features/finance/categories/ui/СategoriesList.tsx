import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RiAddLine, RiPieChartLine } from "@remixicon/react"
// import { RiPieChartLine } from "@remixicon/react"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Link } from "react-router-dom"
import { useGetCategories } from "../model/useGetCategories"
import { CreateOrEditCategoryDialog } from "./CreateOrEditCategoryDialog"
import { CategoryIcon } from "@/shared/lib/categoryHalpers"

export function CategoriesList() {
  const { data: categories, isPending } = useGetCategories()

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {categories?.map((category) => (
          <Link to={`/finance/${category.id}`} key={category.id}>
            <Card className="relative w-full">
              <CardHeader>
                <CardTitle className="z-2 flex gap-2">
                  {category.name}
                </CardTitle>
                <CardDescription className="absolute top-0">
                  <CategoryIcon
                    icon={category.icon || ""}
                    className="opacity-10"
                  />
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
        {categories?.length !== 0 && (
          <CreateOrEditCategoryDialog>
            <Button
              variant="ghost"
              className="h-full min-h-12 w-full border border-border bg-card"
            >
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
