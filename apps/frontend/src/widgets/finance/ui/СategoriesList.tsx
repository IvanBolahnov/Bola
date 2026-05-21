import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  RiAddLine,
  RiDeleteBinLine,
  RiMoreLine,
  RiPencilLine,
  RiPieChartLine,
} from "@remixicon/react"
// import { RiPieChartLine } from "@remixicon/react"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { CategoryIcon } from "@/shared/lib/categoryHalpers"
import { useGetCategories } from "@/features/finance/categories/model/useGetCategories"
import { CreateOrEditCategoryDialog } from "@/features/finance/categories/ui/CreateOrEditCategoryDialog"
import type { Category } from "@/entities/finance/category/model/types"
import { MenuItems, type MenuItem } from "@/shared/ui/MenuItems"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DeleteCategoryDialog } from "@/features/finance/categories/ui/DeleteCategoryDialog"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

const getCategoryMenuItems = (category: Category): MenuItem[] => {
  return [
    {
      dropdownItem: (
        <CreateOrEditCategoryDialog category={category}>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <RiPencilLine />
            Редактировать
          </DropdownMenuItem>
        </CreateOrEditCategoryDialog>
      ),
      contextItem: (
        <CreateOrEditCategoryDialog category={category}>
          <ContextMenuItem onSelect={(e) => e.preventDefault()}>
            <RiPencilLine />
            Редактировать
          </ContextMenuItem>
        </CreateOrEditCategoryDialog>
      ),
    },
    {
      dropdownItem: <DropdownMenuSeparator />,
      contextItem: <ContextMenuSeparator />,
    },
    {
      dropdownItem: (
        <DeleteCategoryDialog category={category}>
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            variant="destructive"
          >
            <RiDeleteBinLine />
            Удалить
          </DropdownMenuItem>
        </DeleteCategoryDialog>
      ),
      contextItem: (
        <DeleteCategoryDialog category={category}>
          <ContextMenuItem
            onSelect={(e) => e.preventDefault()}
            variant="destructive"
          >
            <RiDeleteBinLine />
            Удалить
          </ContextMenuItem>
        </DeleteCategoryDialog>
      ),
    },
  ]
}

export function CategoriesList() {
  const { data: categories, isPending } = useGetCategories()
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {categories?.map((category) => (
          <ContextMenu key={category.id}>
            <ContextMenuTrigger>
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
                  <CardAction>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost">
                          <RiMoreLine />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <MenuItems
                          type="dropdown"
                          items={getCategoryMenuItems(category)}
                        ></MenuItems>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardAction>
                </CardHeader>
              </Card>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <MenuItems
                items={getCategoryMenuItems(category)}
                type="context"
              ></MenuItems>
            </ContextMenuContent>
          </ContextMenu>
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
