export const comments = [
    {
        id: 1,
        comment: 'This is first seed data',
        postId: 1,
        userId: 1
    },
    {
        id: 2,
        comment: 'This is second seed data',
        postId: 1,
        userId: 1
    }
]


/*  id        Int      @id @default(autoincrement()) @map("_id")
comment   String
post      Posts    @relation(fields: [postId], references: [id], onDelete: Cascade)
postId    Int
user      Users?   @relation(fields: [userId], references: [id], onDelete: SetNull)
userId    Int?
createdAt DateTime @default(now()) @map("created_at")
updatedAt DateTime @updatedAt @map("updated_at") */