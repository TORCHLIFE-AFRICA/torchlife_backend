export interface PaginationOptions {
    page?: number;
    limit?: number;
}

export interface PaginationSettings {
    defaultLimit: number;
    maxLimit?: number;
}

export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

/**
 * Main pagination function
 *
 * @param modelCallback - Async function that returns [data, total]
 * @param userOptions - Page and limit provided by user
 * @param settings - Module-specific defaults and limit enforcement
 */
export async function paginate<T>(
    modelCallback: (skip: number, limit: number) => Promise<[T[], number]>,
    userOptions: PaginationOptions = {},
    settings: PaginationSettings = { defaultLimit: 20 },
): Promise<PaginatedResult<T>> {
    const page = userOptions.page && userOptions.page > 0 ? userOptions.page : 1;

    let limit = userOptions.limit ?? settings.defaultLimit;

    if (settings.maxLimit && limit > settings.maxLimit) {
        limit = settings.maxLimit;
    }

    const skip = (page - 1) * limit;

    // Pass skip and limit to your callback
    const [data, total] = await modelCallback(skip, limit);

    return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    };
}
